const ClassementAPI = require("...");

class Classement extends Component {
  constructor(props /* IClassementProps */) {
    super(props);
    this.state = {
      listUser: [],
      currentView: "point",
      viewMonde: false,
    };
  }

  componentDidMount() {
    this._loadDataClassement();
  }

  _setCurrentView = (view) => {} // https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1

  _calculMauvaiseReponse = (item) => {};

  _renderPoint(item) {}

  _renderPodiumElement(user) {}

  render() {
    // Note: j'ai écrit cette fonction a posteriori pour vous
    // permettre de visualiser plus facilement l'utilité du composant.
    // J'ai essayé de coller au mieux au style utilisé dans
    // le reste du composant.
    return (
      <div>
        <h1>Classements du programme en cours</h1>
        { this.props.currentUser?.id_role == 2 && (
          <p>Nb joueurs: {this.state.listIndicateur?.nbJoueur}</p>
        )}
      </div>
    );
  }


  _loadDataClassement = () => {
    let tabBatch = [
      ClassementAPI.getClassement(i18n.language, this.state.currentView, {
        monde: this.state.viewMonde ? 1 : 0,
      }),
    ];
    let isAdmin = false;
    switch (this.props.currentUser.id_role) {
      case 2: //admin
        isAdmin = true;
        tabBatch.push(
          ClassementAPI.getIndicateur()
        );
        break;
      default:
        tabBatch.push(
          ClassementAPI.getClassement(i18n.language, this.state.currentView, {
            monde: this.state.viewMonde ? 1 : 0,
            user: 1,
          })
        );
        break;
    }
    Promise.all(tabBatch)
      .then((data) => {
        this.setState({
          listUser: data[0] ? data[0] : [],
          classementCurrentUser: !isAdmin ? data[1] : null,
          listIndicateur: isAdmin ? data[1] : null,
        });
      });
  };
}
