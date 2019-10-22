import React, { Component } from 'react';
import './App.css';
import 'ol/ol.css'
import { Map, View } from 'ol'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {TileJSON} from 'ol/source'
import Point from 'ol/geom/Point'
import { fromLonLat, toLonLat } from 'ol/proj'
import {Circle as CircleStyle, Icon, Style, Fill, Stroke} from 'ol/style.js';
import { circular as circularPolygon } from 'ol/geom/Polygon.js'
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import image from './data/icon.png'
import image2 from './data/ship.png'
import TextFields from './formcomponent'
import CallerFields from './formcomponent2'
import servername from './const'


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,

  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});
class App extends Component {
  state = {
    rffs: [[-87.921045, 30.238719], [-87.899646, 30.562203], [-88.107891, 30.418700]],
    callers: [],
    center: [-87.921045, 30.458719],
    features: [],
    markers: [],
    currentValue: ''
  }
  rffMarker1 = new Feature({
    // type: 'icon',
    information: "rffMarker1",
    geometry: new Point(fromLonLat(this.state.rffs[0])),
  })
  rffMarker2 = new Feature({
    // type: 'icon',
    information: "rffMarker2",
    geometry: new Point(fromLonLat(this.state.rffs[1])),
  })
  rffMarker3 = new Feature({
    // type: 'icon',
    information: "rffMarker3",
    geometry: new Point(fromLonLat(this.state.rffs[2])),
  })
  
  imageStyle = new Style({
    image: new Icon({
      src: image,
      // the scale factor
      scale: .06,
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
    })
  })

  iconStyle = this.imageStyle

  vectorSource = new VectorSource({
    features: [this.rffMarker1, this.rffMarker2, this.rffMarker3]
  })
  vectorLayer = new VectorLayer({
    source: this.vectorSource,
    renderBuffer: 200
  })

  vectorAlerts = new VectorSource({
    features: this.state.features
  })
  vectorAlertLayer = new VectorLayer({
    source:this.vectorAlerts
  })
  olmap = new Map({
    layers: [
      new TileLayer({
        source: new TileJSON({
          url: 'https://api.maptiler.com/maps/darkmatter/tiles.json?key=XrzPgKMizSI556imElBQ',
          tileSize: 512,
          crossOrigin: 'anonymous'
        })
      }),
      this.vectorAlertLayer,
      this.vectorLayer,
    ],
    view: new View({
      center: fromLonLat(this.state.center),
      zoom: 10
    })
  })
  doesFeatureExist(longitude, latitude) {
    for(var i = 0; i < this.state.rffs.length; i++)
    {
      if(this.state.rffs[i][0] == latitude && this.state.rffs[i][1] == longitude)
      {
        return true;
      }
    }
    return false
  }
  // Study arrow syntax and callbacks if you don't understand the fetch request belowl
  getJsonFromServer() {
    fetch(`${servername}/getrff`)
    .then(res => res.json())
    .then(data=>{
      if(data != null) {
        for(let element of data) {
          //console.log(element)
          if(element.rff_name != null && !this.doesFeatureExist(parseFloat(element.lat), parseFloat(element.lon))) {
              //console.log(element.rff_name)
              //console.log(this.state.rffs)
              this.createRFF(parseFloat(element.lon), parseFloat(element.lat), element.rff_name)
              //console.log(this.state.rffs)
            }
        }
        }
      }
    )
    fetch(`${servername}/getcaller`)
    .then(res => res.json())
    .then(data=>{
      if(data != null) {
        for(let element of data) {
          //console.log(element)
          if(element.mmsi_id != null) {
              //console.log(element.rff_name)
              //console.log(this.state.rffs)
              //if(!this.doesFeatureExist(parseFloat(element.lat), parseFloat(element.lon)))
              this.createCaller(element.rff_1, element.rff_2, element.rff_theta_1, element.rff_theta_2, element.mmsi_id)
              //console.log(this.state.rffs)
            }
        }
        }
      }
    )
  }

  showInfo(event) {
    var features = this.olmap.getFeaturesAtPixel(event.pixel);
    console.info(toLonLat(event.coordinate));
    if (!features) {
      this.setState({
        currentFeatureText: ''
      })
      return;
    }
    var properties = features[0].getProperties();
    console.log(properties.information)
  }
  createRFF(lat, long, name) {
    console.log(lat, long, name)
    var rff = [lat, long]
    this.state.rffs.push(rff);
    var rffMarker = new Feature({
      // type: 'icon',
      information:  name,
      geometry: new Point(fromLonLat([lat, long])),
    })
    this.vectorSource.addFeature(rffMarker)
    this.vectorLayer.source = this.vectorSource
    rffMarker.setStyle(this.iconStyle)
    
    this.vectorAlertLayer.getSource().addFeature(new Feature(circularPolygon([lat, long], 20000, 64).clone().transform('EPSG:4326', 'EPSG:3857')))
  }
  createCaller(rf1, rf2, rt1, rt2, mmsi) {
    //console.log(this.vectorSource.getFeatures()[0].getProperties().information)
    let [lat1, long1] = [0, 0]
    let [lat2, long2] = [0, 0]
    for(let caller of this.vectorSource.getFeatures())
    {
      
      if(caller != null)
      {

        if(caller.getProperties().information == rf1)
        {
        lat1 = toLonLat(caller.getProperties().geometry.flatCoordinates)[0]
        long1 = toLonLat(caller.getProperties().geometry.flatCoordinates)[1]
        
        }
        else if (caller.getProperties().information == rf2)
        {
          lat2 = toLonLat(caller.getProperties().geometry.flatCoordinates)[0]
          long2 = toLonLat(caller.getProperties().geometry.flatCoordinates)[1]
        }
      }
    }
    //calculations
    //m2 * lat + b2 = m1 * lat + b1
    let m1 = Math.tan(rt1)
    let m2 = Math.tan(rt2)
    let b1 = m1 * lat1 - long1
    let b2 = m2 * lat2 - long2
    let lat = (b2 - b1)/(m1-m2)
    let long = m1*lat + b1
    console.log(m1, m2, b1, b2, lat, long)
    
    var newCaller = [-lat, -long]
    this.state.callers.push(newCaller);
    var callermarker = new Feature({
      // type: 'icon',
      information:  mmsi,
      geometry: new Point(fromLonLat([-lat, -long])),
    })
    this.vectorSource.addFeature(callermarker)
    this.vectorLayer.source = this.vectorSource
    callermarker.setStyle(new Style({
      image: new Icon({
        src: image2,
        // the scale factor
        scale: 1,
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
      })
    }))
  }
  componentDidMount() {
    this.rffMarker1.setStyle(this.iconStyle)
    this.rffMarker2.setStyle(this.iconStyle)
    this.rffMarker3.setStyle(this.iconStyle)
    this.olmap.setTarget('map')
    this.olmap.renderSync()
    this.olmap.on('click', this.showInfo.bind(this))
    // this.vectorAlerts.on('addfeature', this.flash.bind(this))
    let radius = 20000
    let edgeCount = 64

    for (var i = 0; i < 3; i++)
    {
      this.vectorAlertLayer.getSource().addFeature(new Feature(circularPolygon(this.state.rffs[i], radius, edgeCount).clone().transform('EPSG:4326', 'EPSG:3857')))
    }
    setInterval(()=>this.getJsonFromServer(), 2000)
    // console.log('This is the servername', servername)
  }

  render() {
    const { classes } = this.props 
    return (
      <div className="App">
        <div id="sidebox" className="omni">
            <button id="menu" title="Open Menu"></button>
            <TextFields rffadd={this.createRFF.bind(this)}></TextFields>
            <CallerFields calleradd={this.createCaller.bind(this)}></CallerFields>
            <button id="LoB" title="Calculate LoB"></button>
          </div> 
        <div id="map" className="map"></div>
        <pre id="info">{this.state.currentFeatureText}</pre>
      </div>
    )
  }
}

export default App;
