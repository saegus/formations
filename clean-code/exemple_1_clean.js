const ClassementAPI = require("...");

class Classement extends Component {
  ADMIN_ID_ROLE = 2;

  constructor(props /* IClassementProps */) {
    super(props);
    this.state = {
      listUser: [],
      currentView: "point",
      viewMonde: false,
    };
  }

  componentDidMount() {
    const isAdmin = this.props.currentUser.id_role == this.ADMIN_ID_ROLE;
    if (isAdmin) this._loadForAdmin();
    else this._loadForUser();
  };

  async _loadForAdmin() {
    const [listUser, listIndicateur] = await Promise.all([
      this._load(),
      ClassementAPI.getIndicateur(),
    ]);

    this.setState({
      listUser,
      classementCurrentUser: null,
      listIndicateur,
    });
  };

  async _loadForUser() {
    const [listUser, classementCurrentUser] = await Promise.all([
      this._load(),
      this._load({user: 1}),
    ]);

    this.setState({
      listUser,
      classementCurrentUser,
      listIndicateur: null,
    });
  };

  _load(options = {}) {
    return ClassementAPI.getClassement(i18n.language, this.state.currentView, {
      ...options,
      monde: this.state.viewMonde,
    });
  };

  _setCurrentView = (view) => {}

  _calculMauvaiseReponse = (item) => {};

  _renderPoint(item) {}

  _renderPodiumElement(user) {}

  render() {
    // Note: j'ai écrit cette fonction a posteriori pour vous
    // permettre de visualiser plus facilement l'utilité du composant.
    // J'ai essayé de coller au mieux au style utilisé dans
    // le reste du composant.
    const {listIndicateur} = this.state;
    const {currentUser} = this.props;
    const isAdmin = currentUser.id_role == this.ADMIN_ID_ROLE;
    return (
      <div>
        <h1>Classements du programme en cours</h1>
        { isAdmin && (
          <p>Nb joueurs: {listIndicateur?.nbJoueur}</p>
        )}
      </div>
    );
  }
}
