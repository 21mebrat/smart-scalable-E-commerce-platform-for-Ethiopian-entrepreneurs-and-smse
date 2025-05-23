const express = require('express')
const merchantRouter = require('./routes/merchant/merchant.route')
const accountRouter = require('./routes/account.route')
const cors = require('cors')
const shopRouter = require('./routes/shop.route')
const imageRouter = require('./routes/image.route')
const pagesRouter = require('./routes/pages.route')
const templateRouter = require('./routes/template.route')
const paymentRouter = require('./routes/payment.route')
const cookieParser = require('cookie-parser')
const handleRefreshToken = require('./controllers/refreshToken.controller')
const locationRouter = require('./routes/location.route')
require('dotenv').config()
const http = require('http');
const { initialize } = require('./utils/socket')
const { testIo } = require('./controllers/merchant.controller')
const merchantTemplatesRouter = require('./routes/merchantTemplates.route')
const customizedPageRouter = require('./routes/customizedPage.route')
const { getMerchantDashboardStats } = require('./controllers/dashboard.controller.js')
const productRouter = require('./routes/product.route')
const cartRouter = require('./routes/user/cart.route.js')
const orderRouter = require('./routes/user/order.route.js')
const analyticsRoutes = require('./routes/dashboardRoutes');
const contactRoute = require('./routes/contact.route');
const adminRoutes = require('./routes/admin.route.js');

// constants  
const PORT = process.env.PORT || 8000
//start the server 
const app = express()
const server = http.createServer(app)
initialize(server); // Initialize Socket.IO

// Enable CORS for specific domains
app.use(cors({
    origin: ['http://localhost:3000', 'https://checkout.chapa.co'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.urlencoded({ extended: true }))
app.use(express.static('uploads'))
app.use(cookieParser())
app.use(express.json())

// chapa payment route
app.use('/api', paymentRouter);
app.use('/api/merchant', merchantRouter)

app.use('/api/cart', cartRouter);// Accounts route
app.use('/api/orders', orderRouter);// Accounts route


app.use('/api/admin', adminRoutes);   // admin Routes



app.get('/api/refresh-token', handleRefreshToken)

app.use('/api/accounts', accountRouter)
app.use('/api/location', locationRouter)
app.use('/api/shops', shopRouter)
app.use('/api/image', imageRouter)
app.use('/api/pages', pagesRouter)
app.use('/api/products', productRouter)
app.use('/api/templates', templateRouter)
app.use('/api/merchantTemplates', merchantTemplatesRouter)
app.use('/api/customized-pages', customizedPageRouter)
app.post('/iopost', testIo)
// dashbaord analytics
app.get('/api/merchant-dashboard/:merchantId', getMerchantDashboardStats)
app.use('/api/dashboard', analyticsRoutes);

// Routes
app.use('/api', contactRoute);
// handling errors
app.use((err, req, res) => {
    if (err.isOperational) {
        err.statusCode = err.statusCode || 500
        err.status = err.status || 'error'
        console.log(err, 'http Error')
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    else {
        // res.status(500).json({
        //     status: 'error',
        //     message: err.message || 'Something went seriously wrong'
        // })
    }
})
//start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
