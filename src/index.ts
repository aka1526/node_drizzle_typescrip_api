import app from "./server";
const port = process.env.PORT || 3000;
const nDate = new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Bangkok'
});
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
  console.log(new Date().toString() );
});