import React, { Component } from 'react'
import 'ol/ol.css';
import { Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls, Control, MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';

import ParkIcon from '../../images/icons/park.svg';
import ChurchIcon from '../../images/icons/church.svg';
import SportIcon from '../../images/icons/sport.svg';
import HostelIcon from '../../images/icons/hostel.svg';
import MemorialIcon from '../../images/icons/memorial.svg';

import styles from './Map.scss';

const posCenter = fromLonLat([39.71065, 47.24011]);

const coordinates = [
    {
        id: 0,
        name: 'Парк ДГТУ',
        point: [39.71065, 47.24011],
        icon: ParkIcon,
        description: 'Студенческий парк'
    },
    {
        id: 1,
        name: 'Церковь при ДГТУ',
        point: [39.71109, 47.23931],
        icon: ChurchIcon,
        description: 'Храм святой мученицы Татианы'
    },
    {
        id: 2,
        name: 'Спортивный манеж',
        point: [39.70892, 47.24088],
        icon: SportIcon,
        description: 'Легко-атлетический манеж ДГТУ'
    },
    {
        id: 3,
        name: 'Общежитие ДГТУ',
        point: [39.71271, 47.23941],
        icon: HostelIcon,
        description: 'Студенческое общежитие'
    },
    {
        id: 4,
        name: 'Памятник студентам и сотрудникам РИСХМ',
        point: [39.71038, 47.23929],
        icon: MemorialIcon,
        description: 'Установлен 08.05.1982'
    }
]

//TO-DO
/**
 * 1 - Посмотреть позиционироваие иконок
 */

const getFeatures = (points) => {
    let ftArray = [];

    ftArray = points.map(function(item){
        let feature = new Feature({
            geometry: new Point(fromLonLat(item.point)),
            name: item.name,
            id: item.id,
            descr: item.description,
        });

        feature.setStyle(new Style({
            image: new Icon({
                crossOrigin: 'anonymous',
                anchor: [0.5, 20],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: item.icon
            })
        }));
        return feature;
    });

    return ftArray;
}

class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {popupTitle: '', popupDescription: ''}
    }

    CurrentMap = null;
    popup = null;
    viewMap = null;

    componentDidMount() {
        this.viewMap = new View({
            center: posCenter,
            zoom: 17
        });

        const vectorSource = new VectorSource({
            features: getFeatures(coordinates)
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource
        });

        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326',
            target: this.refs.mousePosition,
            undefinedHTML: '&nbsp',
            className: 'Map__mousePos'
        });

        const mouseControl = new Control({element: this.refs.mousePosition});

        const listControl = new Control({element: this.refs.objectList})

        this.CurrentMap = new Map({
            controls: defaultControls().extend([
                mousePosition,
                mouseControl,
                listControl
            ]),
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayer
            ],
            target: this.refs.mapContainer,
            view: this.viewMap
        })

        this.popup = new Overlay({
            element: this.refs.popupContainer,
            positioning: 'center-bottom',
            stopEvent: false,
            offset: [0, 15],
        });

        this.CurrentMap.on('click', (e) => {

            const feature = this.CurrentMap.forEachFeatureAtPixel(e.pixel, function(item){return item}); 

            if (feature) {
                const coord = feature.getGeometry().getCoordinates();
                this.setState({
                    popupTitle: feature.get('name'),
                    popupDescription: feature.get('descr')
                });
                this.popup.setPosition(coord);
                this.CurrentMap.addOverlay(this.popup);
            } else {
                this.closePopup();
            }
        });
    }

    closePopup = () => {
        this.CurrentMap.removeOverlay(this.popup);
    };

    listItemClick = (item) => {
        this.setState({
            popupTitle: item.name,
            popupDescription: item.description
        });
        this.popup.setPosition(fromLonLat(item.point));
        this.CurrentMap.addOverlay(this.popup);
        this.viewMap.setCenter(fromLonLat(item.point))
        console.log()
    }
    
    render() {
        const objectList = coordinates.map((item) => {
            return (
                <li key={item.id} onClick={() => this.listItemClick(item)}>
                    <span className={styles.Map__listItemTitle}>{item.name}</span>
                    <span className={styles.Map__listItemDescr}>{item.description}</span>
                </li>
            )
        });

        return (
            <div ref="mapContainer" className={styles.Map}>
                <div ref="popupContainer" className={styles.Map__popup}>
                    <span className={styles.Map__popupClose} onClick={this.closePopup}>X</span>
                    <p className={styles.Map__popupTitle}>{this.state.popupTitle}</p>
                    <p className={styles.Map__popupDescription}>{this.state.popupDescription}</p>
                </div>
                <div ref="mousePosition"></div>
                <div ref="objectList" className={styles.Map__list}><ul>{objectList}</ul></div>
            </div>);
    }
}

export default MapContainer;