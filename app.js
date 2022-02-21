const express = require('express');  
const app = express();
const fs = require('fs');
const morgan = require('morgan');
app.use(express.json());


//our own Middleware
app.use((req, res, next) => {
    console.log('Hello Middleware');
    next();
})
 app.use((req, res, next) => {
     req.requestTime = new Date().toISOString();
     next();
 })

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/data/data.json`));

    const postData = (req, res) => {
        // console.log(req.body);
        const newId = tours[tours.length-1].id+1;
        const newTour = Object.assign({ id:newId }, req.body);
         tours.push(newTour);
         fs.writeFile(
             `${__dirname}/data/data.json`,
             JSON.stringify(tours),
             err => {
                 res.status(201).json({
                     status:'success',
                     data:{
                         tour:newTour
                     }
                 })
             }
         )
        
        // res.send('Done')
        }

        const getAllData = (req, res) => {
            res.status('200').json({
                status: 'success',
                length: tours.length,
                time: req.requestTime,
                data: 
                    tours
                
            })
        }

        const getSpecificData = (req, res) => {
            const id = req.params.id*1;
            // if(id > tours.length) {
            //     return res.status(404).json({
            //         status: "fail",
            //         message: "Not Valid ID"
            //     })
            // }
            
            const tour = tours.find(el => el.id === id);
            
            if(!tour) {
                return res.status(404).json({
                    status: "fail",
                    message: "Not Valid ID"
                })
            }
            
                res.status('200').json({
                    status: 'success',
                    
                    data: 
                        {tour}
                    
                })
            }

            const patchData = (req, res) => {
    
                if(req.params.id* 1 > tours.length) {
                       return res.status(404).json({
                            status: "fail",
                            message: "Not Valid ID"
                       })
                   }
               res.status(200).json({
                   status: "ok",
                   message: "update data",
                   data: {
                       data: "<>Data update<>"
                   }
               })
           }

           const deleteData = (req, res) => {
    
            if(req.params.id* 1 > tours.length) {
                   return res.status(404).json({
                        status: "fail",
                        message: "Not Valid ID"
                   })
               }
           res.status(204).json({
               status: "ok delete",
               message: "delete done",
               data: null
           })
        }

    // POST Data
// app.post('/api/v1/tours', postData )

    // GET Data
// app.get('/api/v1/tours', getAllData )

// GET Specific ID Data
// app.get('/api/v1/tours/:id', getSpecificData )

// Patch Data
// app.patch('/api/v1/tours/:id', patchData )

// Delete data 
// app.delete('/api/v1/tours/:id', deleteData )

app
.route('/api/v1/tours')
.get(getAllData)
.post(postData);
app
.route('/api/v1/tours/:id')
.get(getSpecificData)
.patch(patchData)
.delete(deleteData)

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})