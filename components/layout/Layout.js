import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.css";

function Layout(props) {
  return (
    <div>
      <MainNavigation />
      <h1>HELLO MAN ITS WORKING </h1>
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
