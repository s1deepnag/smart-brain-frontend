import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

const particlesOptions = {
  particles: {

    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
    /*line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }*/
  }
}
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: new Date()
  }
}
class App extends Component {
  
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    console.log('loading the user data.. :)');
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
    }
    })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
  
     // imageUrl can't be passed here due to how react works.. Why?
     fetch('https://glacial-meadow-61437.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: this.state.input 
      })
    }).then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://glacial-meadow-61437.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id 
            })
        }).then(response => response.json())
        .then(count => this.setState(Object.assign(this.state.user, {entries: count})))
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));

  }
  
  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    } else if(route === 'signin') {
      this.setState({ isSignedIn: true});
    }
    this.setState({ route: route});
  }

  render() {
    const { isSignedIn, box, imageUrl, route} = this.state;

    return (
      <div className="App">
  
        <Particles className='particles'
        params={particlesOptions}
        />
  
        <Navigation 
        onRouteChange={this.onRouteChange}
        isSignedIn={isSignedIn}/>
          
        {route === 'home'
          ? <div> 
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition 
            box={box}
            imageUrl={imageUrl}/>
          </div>
          : ( route === 'signin'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
