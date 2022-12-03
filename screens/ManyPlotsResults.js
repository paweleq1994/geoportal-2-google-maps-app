import {Linking, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import axios from "axios";
import proj4 from '../assets/proj4'
import {humanReadableCoordinates} from "./SinglePlot";
import React, {useEffect, useState} from "react";
import Checkbox from 'expo-checkbox';

export default function ManyPlotsResults({route}) {
    let [responseGeo, setResponseGeo] = useState([]);
    const [urlsArr, setUrlsArr] = useState([]);
    const [startAddress, setStartAddress] = useState('')
    const [endAddress, setEndAddress] = useState('')

    const data = route.params.data.filter(e => e.key !== "" && e.value !== 0)

    proj4.defs("EPSG:2180","+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs +type=crs");

    useEffect(() => {
        data.forEach(e => search(e.value))
    }, [])

    const search = (text) => {
        axios.get(`https://uldk.gugik.gov.pl/?request=GetParcelByIdOrNr&id=${text}&result=teryt%2Cparcel%2Cgeom_wkt&srid=2180`)
            .then(async r => {
                if(r.data.startsWith("-1")) {
                    setResponseGeo(prevState => [...prevState, {
                        haveError: true,
                        input: text,
                        error: r.data.replace('-1', '')
                    }])

                    return
                }

                const coordinates = humanReadableCoordinates(r);
                const googleUrl = "https://www.google.pl/maps/place/";
                let tmp = [];

                coordinates.forEach(e => tmp.push(googleUrl + e));
                setResponseGeo(prevState => [...prevState, {
                    input: text,
                    urls: tmp
                }])
            })
            .catch(e => {
                console.log(e)
            })
    }

    function renderUrls() {
        let errorBag = [];
        let urls = [];

        responseGeo.forEach(e => e.haveError ? errorBag.push(e) : urls.push(e))

        return errorBag.length > 0 ? {errors: true, errorBag: errorBag} : {errors: false, urls: urls}
    }

    const onCheckboxChange = (url) => {
        urlsArr.find(e => e === url)
            ? setUrlsArr(urlsArr.filter(e => e !== url))
            : setUrlsArr(prevState => [...prevState, url])
    }

    const renderData = () => {
        if (!!responseGeo && responseGeo.length > 0) {

            if (renderUrls().errors) {
                return renderUrls().errorBag.map((e, i) => (
                    <Text key={i} style={{marginTop: 15}}>
                        {e.input}: {e.error}
                    </Text>)
                )
            }

            return renderUrls().urls.map((e,i) => (
                <View style={{marginBottom: 15}} key={i}>
                    <Text style={{fontWeight: '600', fontSize: 20}}>{e.input}</Text>
                    {e.urls.map((url, index) => (
                        <View key={index} style={{flexDirection: 'row', marginBottom: 10}}>
                            <View style={styles.urlContainer}>
                                <Text style={{color: 'blue'}}
                                      onPress={() => Linking.openURL(url + '')}
                                >
                                    {url}
                                </Text>
                            </View>
                            <View style={styles.checkboxContainer}>
                                <Checkbox
                                    style={{width: 30, height: 30}}
                                    value={urlsArr.find(e => e === url)}
                                    onValueChange={() => onCheckboxChange(url)}
                                    color={urlsArr.find(e => e === url) ? '#4630EB' : undefined}
                                />
                            </View>
                        </View>
                    ))}
                </View>
               )
            )
        }
    }

    const generateRoute = () => {
        const coordinates = urlsArr.map(e => e.split("/").reverse()[0])

        console.log(coordinates)
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {renderData()}
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={styles.button}
                        onPress={generateRoute}
                    >
                        <Text style={styles.text}>Generuj trasę z zaznaczonych</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    buttonContainer: {
        marginBottom: 60,
        marginTop: 20
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: '#2196F3'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    urlContainer: {
        flex: 13,
    },
    checkboxContainer: {
        alignItems: "flex-end",
        flex: 2,
        justifyContent: "center",
    }
})