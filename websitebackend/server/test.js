// how to CRUD data of a model
var models = require('./server.js').models;

//create
/*
models.Profile.create( {name:'Drew',id:'5eac51ecf8b11c58fc3a20cd'}, (err,profile ) => {
    console.log ('data?',err,profile)
})
*/
// update or insert
/*
models.Profile.upsert( {name:'Drew2',id:'5eac51ecf8b11c58fc3a20cd'}, (err,profile ) => {
    console.log ('data?',err,profile)
})
*/
// find/create
/*
models.Profile.findOrCreate( {name:'Drew3'}, (err,profile ) => {
    console.log ('data?',err,profile)
    if(err) {
        console.log("ERRor->",err)
    }else if (profile) {
        // update many attributes
        profile.updateAttributes ( {
            email:"drew3@drew.com"
        }, (updateError,update) => {
            console.log("updated attrs",updateError,update)
        })
       // update one attribute/modify the object
       profile.email="drew@drew.com"
       profile.save( (ue,updated) => {
           console.log("Updated?",updated)
       })
    }
})
*/
function populateDatabase() {
    //Populate Database
    var toSave = [
        {name:"Drew1",email:"1drew@drew.com"},
        {name:"Drew2",email:"d2rew@drew.com"},
        {name:"Drew3",email:"dr3ew@drew.com"},
        {name:"Drew4",email:"dre4w@drew.com"},
        {name:"Drew5",email:"drew5@drew.com"},
        {name:"Drew6",email:"drew@6drew.com"},
        {name:"Drew7",email:"drew@d7rew.com"},
        {name:"Drew8",email:"drew@dr8ew.com"},
        {name:"Drew9",email:"drew@dre9w.com"},
        {name:"Drew10",email:"drew@drew10.com"},
    ]

    toSave.map(obj => {
        models.Profile.create(obj, (err,created) => {
            console.log("created",created)
        })
    })
}

var filter = {
    // where clauses
    where: {
        //name:'Drew'
        name: { like: 'Drew' }
        // lt gt gte
        //postCount : {gte : 10}
    },
    // order by clause, sep by comma?
    //order: 'name DESC',
    // limit on the return
    //limit: 5,
    //skip : 4,
    fields: { email: true }
    // include related models, user & Profile.Posts.image
    //include : ['user',{Posts: 'Image'}]
    /*
    include: {
        // related table
        relation: 'Posts',
        // filter
        scope: {
            // limit applies to relation
            limit: 5,
            order: 'date DESC',
            // includes the first image thumbnail for the post
            include: {
                relation: 'Image',
                limit: 1,
                where: { type: 'thumbnail' }
            }
        }
    }
    */
    //scope: "" (foreign key stuff)
}

// in insert order of the db
/*
models.Profile.findOne({
    where: { name: 'Drew'},order : 'id DESC'
},
    (err, found) => {
        console.log("find one", err, found)
    }
)
*/

/*
models.Profile.find(filter,
    (err, found) => {
        console.log("find", err, found)
    }
)
*/
/*
models.Profile.findById("5eac636dea3ebd2424f2506a", filter,
    (err, found) => {
        console.log("find", err, found)
    })
*/
// delete
/*
models.Profile.findById("5eac636dea3ebd2424f2506a", filter,
    (err, found) => {
        console.log("destroyOne", err, found)
        found.destroy()
    })
*/
/*
models.Profile.destroyAll(filter.where,
    (err, found) => {
        console.log("destroyAll", err, found)
    })
*/

//populateDatabase()
// process.exit()