import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb"; // to sie tez importuje do server side
import Head from "next/head";
import { Fragment } from "react";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React meetups!</title>
        <meta
          name="description"
          content="Our highly visited website for React meetups."
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
};

// export async function getServerSideProps(context) {
//   const req = context.req;

//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }
export async function getStaticProps() {
  // server side code
  // fetch API, standardowa procedura wyciagania danych z wlasnego endpointa (swojej bazy danych)
  const client = await MongoClient.connect(
    "mongodb+srv://maziukweb:s9UVibnoSxRDycfX@cluster0.x59ps4d.mongodb.net/meetups?retryWrites=true&w=majority" // dodalem meetups po net/
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray(); // find defaultowo znajduje wszzystkie dokumenty w danej kolekcji
  client.close();
  return {
    props: {
      // set props and wait to load props.
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, // re-generate page every 10 seconds IF there are requests coming
  };
}
export default HomePage;
