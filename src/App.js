import React, { Component } from 'react';
import './App.css';
import 'ol/ol.css'
import { Map, View } from 'ol'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {TileJSON} from 'ol/source'
import Point from 'ol/geom/Point'
import { fromLonLat, toLonLat } from 'ol/proj'
import {Icon, Style} from 'ol/style.js';
import { circular as circularPolygon } from 'ol/geom/Polygon.js'
import LineString from 'ol/geom/LineString.js'
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import image from './data/icon.png'
import image2 from './data/ship.png'
import TextFields from './formcomponent'
import CallerFields from './formcomponent2'
import Snack from './formcomponent3'
import Men from './formcomponent4'
import servername from './const'


class App extends Component {
  state = {
    rffs: [],
    callers: [],
    center: [-92.421045, 29.758719],
    features: [],
    markers: [],
    currentFeatureText: ''
  }


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
    features: []
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
      if(this.state.rffs[i][0] === latitude && this.state.rffs[i][1] === longitude)
      {
        return true;
      }
    }
    return false
  }
  doesCallerExist(longitude, latitude) {
    for(var i = 0; i < this.state.callers.length; i++)
    {
      if(this.state.callers[i][0] === latitude && this.state.callers[i][1] === longitude)
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
              this.createCaller(element.rff_1, element.rff_2, element.rff_theta_1, element.rff_theta_2, element.mmsi_id, element.num_people, element.vessel_info, element.time_stamp, element.call_id)
              //console.log(this.state.rffs)
            }
        }
        }
      }
    )
  }
  createRFF(lat, long, name) {

    var rff = [lat, long]
    this.state.rffs.push(rff);
    var rffMarker = new Feature({
      // type: 'icon',
      information:  [name],
      geometry: new Point(fromLonLat([lat, long])),
    })
    this.vectorSource.addFeature(rffMarker)
    this.vectorLayer.source = this.vectorSource
    rffMarker.setStyle(this.iconStyle)

    this.vectorAlertLayer.getSource().addFeature(new Feature(circularPolygon([lat, long], 20000, 64).clone().transform('EPSG:4326', 'EPSG:3857')))
  }
  createCaller(rf1, rf2, rt1, rt2, mmsi, np, vessinfo, ts, callerid) {
    //console.log(this.vectorSource.getFeatures()[0].getProperties().information)
    let [lat1, long1] = [0, 0]
    let [lat2, long2] = [0, 0]
    for(let rff of this.vectorSource.getFeatures())
    {

      if(rff != null)
      {

        if(rff.getProperties().information[0] === rf1)
        {
        lat1 = toLonLat(rff.getProperties().geometry.flatCoordinates)[0]
        long1 = toLonLat(rff.getProperties().geometry.flatCoordinates)[1]

        }
        else if (rff.getProperties().information[0] === rf2)
        {
          lat2 = toLonLat(rff.getProperties().geometry.flatCoordinates)[0]
          long2 = toLonLat(rff.getProperties().geometry.flatCoordinates)[1]
        }
      }
    }
    //calculations
    //m2 * lat + b2 = m1 * lat + b1
    let m1 = Math.tan(rt1 * Math.PI/180)
    let m2 = Math.tan(rt2 * Math.PI/180)
    let b1 = m1 * lat1 - long1
    let b2 = m2 * lat2 - long2
    let lat = (b2 - b1)/(m1-m2)
    let long = m1*lat + b1
    //console.log(lat1, long1, rt1, rt2, m1, m2, b1, b2, lat, long)

    var newCaller = [-lat, -long]
    if(this.doesCallerExist( newCaller[1],newCaller[0]))
    {
      return
    }
    this.state.callers.push(newCaller);


    let point = new Point(fromLonLat([-lat, -long]))
    var callermarker = new Feature({
      // type: 'icon',
      information:  [ mmsi,  np, vessinfo,  ts, callerid],
      geometry: point,
    })
    this.vectorSource.addFeature(callermarker)
    this.vectorLayer.source = this.vectorSource

    var linie2 = new VectorLayer({
      source: new VectorSource({
      features: [new Feature({
        geometry: new LineString([fromLonLat([lat1, long1]), fromLonLat([-lat, -long])]),
        }),new Feature({
          geometry: new LineString([fromLonLat([lat2, long2]), fromLonLat([-lat, -long])]),
          })]
      }),
      info: callerid,
    })
    this.olmap.addLayer(linie2)

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

    this.olmap.setTarget('map')
    this.olmap.renderSync()
    this.olmap.on('click', this.showInfo.bind(this))
    // this.vectorAlerts.on('addfeature', this.flash.bind(this))
    let radius = 20000
    let edgeCount = 64
    console.log("oi")
    for (var i = 0; i < this.state.rffs.length; i++)
    {
      this.vectorAlertLayer.getSource().addFeature(new Feature(circularPolygon(this.state.rffs[i], radius, edgeCount).clone().transform('EPSG:4326', 'EPSG:3857')))
    }
    setInterval(()=>this.getJsonFromServer(), 2000)
    // console.log('This is the servername', servername)
  }
  showInfo(event) {
    var features = this.olmap.getFeaturesAtPixel(event.pixel);
    //console.info(toLonLat(event.coordinate));
    if (!features) {
      this.setState({
        currentFeatureText: ''
      })
      return;
    }
    var properties = features[0].getProperties();
    let information = properties.information
    if (!information) { return; }
    else {
      this.setState({
        currentFeatureText: information
      })
      if (information[2])
      {
        //caculate distance
        console.log(toLonLat(properties.geometry.flatCoordinates))
      }
    }
  }
  callerDelete = (callerid) => {
    let rlayer
    this.olmap.getLayers().forEach(function (layer) {
      if(layer.get('info') != null && layer.get('info') === callerid) {
        rlayer = layer;
        return
        }})
    this.olmap.removeLayer(rlayer)
    let rfeature
    let features = this.vectorSource.getFeatures()
    for(let i = 0; i < features.length; i++) {
      if(features[i]['values_']['information'] != null && features[i]['values_']['information'][4] === callerid)
      {
        rfeature = features[i]
        this.setState({
          currentFeatureText: ''
        })
        break
      }
    }
    this.state.callers.pop(toLonLat(rfeature['values_']['geometry']))
    this.vectorSource.removeFeature(rfeature)
    //make post method of delete?
  }
  render() {

    return (
      <div className="App">
        <div id="sidebox" className="omni">
            <Men/>
            <TextFields rffadd={this.createRFF.bind(this)}></TextFields>
            <CallerFields calleradd={this.createCaller.bind(this)}></CallerFields>
            <Snack info={this.state.currentFeatureText} callerDelete={this.callerDelete.bind(this)} />
          </div>
        <div id="map" className="map"></div>
      </div>


    )
  }
}

export default App;
