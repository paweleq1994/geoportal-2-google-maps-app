import React, {useState} from "react";
import {Button, Dimensions, Linking, StyleSheet, Text, TextInput, View} from 'react-native';
import axios from "axios";
import proj4 from './assets/proj4'

export default function App() {
    const [text, setText] = useState("");
    let [responseGeo, setResponseGeo] = useState([]);

    proj4.defs("EPSG:2180","+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs +type=crs");

    const getPolygons = (r) => {
        let polygonAmounts = r.data.split('\n', 1)[0]
        let polygons = [];

        for (let i = 1; i <= polygonAmounts; i++) {
            let polygon = r.data.split('\n')[i].split("POLYGON((")[1].split("))")[0].split(" ");

            if (!polygon[0].includes(",") && !polygon[polygon.length -1].includes(",")) {
                polygon[0] = polygon[polygon.length -1] + "," + polygon[0];
                polygon.pop();
            }

            polygons.push(polygon)
        }

        return polygons
    }

    const humanReadableCoordinates = (r) => {
        let polygons = getPolygons(r);
        let newPolygons = []
        let approxCenters = [];
        let x = [];
        let y = [];

        polygons.forEach(polygon => {
            let tmp = [];
            polygon.forEach((e,i) => {
                tmp.push(proj4(proj4('EPSG:2180'), proj4('EPSG:4326'), e.split(',').map(ee => parseFloat(ee)).reverse()))
            })
            newPolygons.push(tmp.map(e => e.reverse()))
        })

        newPolygons.forEach(e => {
            e.forEach(ee => {
                x.push(ee[0])
                y.push(ee[1])
            })

            approxCenters.push([x.reduce((partialSum, a) => partialSum + a, 0)/x.length, y.reduce((partialSum, a) => partialSum + a, 0)/y.length])
        })

        return approxCenters
    }

    const search = () => {
        axios.get(`https://uldk.gugik.gov.pl/?request=GetParcelByIdOrNr&id=${text}&result=teryt%2Cparcel%2Cgeom_wkt&srid=2180`)
            .then(async r => {
                if(r.data.startsWith("-1")) {
                    setResponseGeo([r.data.replace('-1', '')])

                    return
                }

                const coordinates = humanReadableCoordinates(r);
                const googleUrl = "https://www.google.pl/maps/place/";
                let tmp = [];

                coordinates.forEach(e => tmp.push(googleUrl + e));
                setResponseGeo(tmp)

                if (coordinates.length === 1) {
                    await Linking.openURL(googleUrl + coordinates)
                }
            })
            .catch(e => {
                console.log(e)
            })
    }

    function renderUrls() {
        if (responseGeo.length > 0 && !responseGeo[0].startsWith('https://')) {
            return (
                <Text style={{marginTop: 15}}>
                    {responseGeo}
                </Text>
            )
        }

        return responseGeo.map(e => {
            return (
                <Text style={{color: 'blue', marginTop: 15}}
                      onPress={() => Linking.openURL(e + '')}
                      key={e}
                >
                    {e}
                </Text>
            )
        })
    }


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={text => {
                    setText(text);
                    setResponseGeo([])
                }}
                value={text}
                placeholder={'Wyszukaj działkę'}
            />
            <Button
                title={'Szukaj'}
                onPress={search}
            />
            {renderUrls()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 50
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: Dimensions.get('window').width - 20
    },
});
