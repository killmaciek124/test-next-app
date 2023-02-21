import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb"; // id w mongodb to jakis dziwny object ...
import { Fragment } from "react";
import Head from "next/head";
//... możesz zerknąć na stronie webowej, dlatego uzywamy tej funkcji jako wrapper/konwerter do stringa.

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title> {/*dane z getStaticProps */}
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        alt={props.meetupData.alt}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

export async function getStaticPaths() {
  // supported pathy z URL (meetupId nazwa folderku)

  const client = await MongoClient.connect(
    "mongodb+srv://maziukweb:s9UVibnoSxRDycfX@cluster0.x59ps4d.mongodb.net/meetups?retryWrites=true&w=majority" // dodalem meetups po net/
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();
  // linia z findem oznacza że wyciagamy wszystkie dokumenty z kolekcji ('{}'), a w drugim argumencie finda
  // ('{_id: 1}') mowimy ze wyciagamy TYLKO id dla kazdego dokumentu
  return {
    fallback: false, // false => jesli nie bedzie zadnego patha (m1/m2) w url to wyskoczy error 404
    // fallback: true => nextjs bedzie czekal na incoming requesty i bedzie probowac zrenderowc strone
    paths: meetups.map((meetup) => ({
      // dynamic paths do pre -renderingu
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup
  const meetupId = context.params.meetupId; // nazwa folderu (czyli dynamic path meetupId)

  const client = await MongoClient.connect(
    "mongodb+srv://maziukweb:s9UVibnoSxRDycfX@cluster0.x59ps4d.mongodb.net/meetups?retryWrites=true&w=majority" // dodalem meetups po net/
  );

  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  }); // z lini 42 meetupId czyli nazwa folderku
  client.close();

  return {
    props: {
      // w tym propsie przekazujemy dane do komponentu wyżej (MeetupDetails) zfettchowane i z pre-renderowane.
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
