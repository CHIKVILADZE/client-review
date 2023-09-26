import Posts from '../components/Posts';
import PopularTags from '../components/PopularTags';

function Home({ t, handleChangeLanguage }) {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 col-sm-12">
          <Posts t={t} />
        </div>
        <div className="col-md-4 col-sm-12">
          <PopularTags t={t} />
        </div>
      </div>
    </div>
  );
}

export default Home;
