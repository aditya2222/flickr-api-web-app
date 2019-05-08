import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
  };


  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      page:1
    };
    this.cloneImage = this.cloneImage.bind(this)
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages = (tag) => {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&page=${this.state.page}&tag_mode=any&per_page=500&format=json&safe_search=1&nojsoncallback=1`;
    this.setState({page:this.state.page+1})
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          console.log(this.state.images)
          this.setState({images: this.state.images.length===0?res.photos.photo:this.state.images.concat(res.photos.photo.filter((el)=>{

            if(el.title!=="[New post] undefined"){
              return true
            }
            return false

          }))});
          setInterval(this.loadNextPage(res), 5000)
      
     
        }
      });
  }

  loadNextPage = (res) => {
    if(res.photos.photo[0]){
            console.log('body entered')
            setTimeout(this.getImages, 10000)
          }
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: document.body.clientWidth
    });
    
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  //*Just Coping(Clone) an image*/
  cloneImage(i,img){
    this.state.images.splice(i,0,img)
    this.setState({
      images: this.state.images
    })
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto,i) => {
          return <Image clone={this.cloneImage} index={i} key={'image-' + i} dto={dto} galleryWidth={this.state.galleryWidth}/>;
        })}
      </div>
    );
  }
}

export default Gallery;
