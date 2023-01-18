const expr = require("express");
const app = expr();
const path = require("path");
const rtIndex=require("./rotes/routerIndex");
const rtApi = require('./rotes/routes');
const compression = require('compression');
const Handlebars = require("express-handlebars");
const handlebars = Handlebars.create({
    defaultLayout: "index",
    extname: "hbs"
});
const bodyParser = require('body-parser');
app.use(expr.static(path.join(__dirname, "public")));
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(compression());
app.use(bodyParser.json());
app.use(expr.urlencoded({ extended: true }));
app.use(rtIndex);
app.use('/api', rtApi);
const PORT = process.env.PORT || 3000;
function start() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e.message);
    }
}

start();