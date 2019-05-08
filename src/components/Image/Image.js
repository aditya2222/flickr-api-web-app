import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import Modal from 'react-modal';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      modalIsOpen: false,
      largImgClass: ""
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }
  //***using this function expaning our image, and newely created image is merging with in all images class */
  openModal() {
    this.setState({ modalIsOpen: true });
    this.setState({
      largImgClass: ReactDOM.findDOMNode(this).className.split(" ")[1] && ReactDOM.findDOMNode(this).className.split(" ")[1]
    })
  }
//***It will colse the expanding image popup */
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  
  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }
/***this function is using to add class for diffrent css filters  */
  filter() {
    let filter = Math.round(Math.random() * 5);
    ReactDOM.findDOMNode(this).className = `image-root filter${filter}`
  }

  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
      >
        <div>
          <FontAwesome className="image-icon" name="clone" title="clone" onClick={() => this.props.clone(this.props.index, this.props.dto)} />
          <FontAwesome className="image-icon" name="filter" title="filter" onClick={this.filter.bind(this)} />
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.openModal} />
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <img className={this.state.largImgClass} src={`${this.urlFromDto(this.props.dto)}`} />
          <FontAwesome style={{ fontSize: 28, position: "absolute", top: 25, right: 25, cursor: 'pointer' }} className="image-icon" name="times" title="times" onClick={this.closeModal} />
        </Modal>
      </div>
    );
  }
}

export default Image;
