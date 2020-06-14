const { createReadStream } = require('fs');
const { pipeline } = require('stream');
const { createServer } = require('http');
const express = express

const app = express();


exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })
  
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  });


// app.use(express.json());
// app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// // 3) ROUTES
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// app.use(globalErrorHandler);

// module.exports = app;






const server = createServer(
    (req, res) => {
        pipeline(createReadStream('./img/christmas.mp4'), res, (err) => {
            if(err) console.log(err);
        })
    }
)

server.listen(3000)