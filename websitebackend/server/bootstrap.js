// how to CRUD data of a model
var models = require('./server.js').models;

// create the new user
function createDefaultUser() {
    models.user.find((err, result) => {
        if (result.length === 0) {
            const user = {
                email: 'd2@d2.com',
                password: 'test',
                username: 'd2',
            };

            models.user.create(user, (err, result) => {
                console.log("tried to create user", err, result)
            })
        }
    })
}


function mapRoleToDefaultUser(role) {
    if (role) {
        models.user.findOne((usererr, user) => {
            if (!usererr && user) {
                role.principals.create({
                    principalType: models.RoleMapping.USER,
                    principalId: user.id,
                }, (err3, princ) => {
                    console.log("created principal", err3, princ)
                })
            }
        })
    } else {
        console.log("why did you pass me an empty role?")
    }

}

// use lb acl to map the roles which writes to the acls of the [class].json file
// $owner access references belongsTo relation in json
function createAdminRole() {
    models.Role.findOne({ where: { name: "admin" } }, (err, role) => {
        if (!err && role) {
            console.log('role is', role, role.name, role.principals)
            if (role.length === 0) {
                models.Role.create({
                    name: "admin",
                },
                    (err2, created) => {
                        console.log("created role",created)
                        if (!err2 && created) {
                            mapRoleToDefaultUser(created)
                        }
                    })
            } else {
                mapRoleToDefaultUser(role)
            }
        }
    })
}

function createEditorRole() {
    models.Role.findOne({ where: { name: "editor" } }, (err, role) => {
        if (!err) {
            if (!role) {
                models.Role.create({
                    name: 'editor',
                },
                    (err2, created) => {
                        console.log("created role",created)
                        if (!err2 && created) {
                            mapRoleToDefaultUser(created)
                        }
                    })
            } else {
                mapRoleToDefaultUser(role)
            }
        }
    })
}

function createDefaultPost() {
    models.Post.findOne( {where: {title:"Default Post"}}, (err, post ) => {
        if (!err) {
            if(!post) {
                date = new Date()
                models.Post.create( {title : "Default Post", slug: "DP", content:"This is the default post", created_at : date, last_edited_at : date}, (err,newPost) => {
                    console.log("Created?",err,newPost)
                })
            }
        }
    })
}

function createDefaultCategory() {
    models.Category.findOne( {where : {name : "Default"}}, (err, cat) => {
        if (!err) {
            if(!cat) {
                date = new Date()
                models.Category.create( {name:"Default",slug : "DC",created_at : date}, (err,newCat) => {
                    console.log("Created?",err,newCat)
                })  
            }
        }
    })
}

function connectPostAndCat() {
    models.Post.findOne( {where : {title: "Default Post"}}, (err, post) => {
        if(!err) {
            console.log("Post?",err,post)
            models.Category.findOne ({where : {name:"Default"}}, (err, cat) => {
                if(!err) {
                    console.log("Category?",err,cat)
                    cat.posts.create( { 
                        postType : models.PostMapping.CATEGORY,
                        postId : post.id
                    } )
                }
            })
        }
    })
}

// createDefaultUser()
// createAdminRole()
// createEditorRole()
createDefaultCategory()
createDefaultPost()
connectPostAndCat()

//process.exit(0)