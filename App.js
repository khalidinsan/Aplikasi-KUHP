import React from 'react';
import { BackHandler, Alert, ActivityIndicator, Image, FlatList, SafeAreaView, View, Text, Button, TouchableOpacity, StyleSheet, StatusBar, TextInput, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { openDatabase } from 'react-native-sqlite-storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';
var db = openDatabase({ name: 'kuhp.db', createFromLocation : 1});
class ActionBarImage extends React.Component {
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
      <Image
      source={require('./img/icon2.png')}
      style={{
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        marginLeft: 15
      }}
      />
      </View>
      );
  }
}
class HomeScreen extends React.Component {  
  static navigationOptions = ({ navigation }) => {
    return{
      title: 'KUHP',
      headerStyle: {
        backgroundColor: '#f03434'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerLeft: <ActionBarImage />,
      headerRight: () => (  
        <TouchableOpacity onPress={() => {
          navigation.push('About');
        }}
        style={{right: Platform.OS === 'ios' ? Dimensions.get("window").height < 667 ?  '10%' : '5%' : '25%', backgroundColor: 'transparent', paddingLeft: 15}}>
        <Icon name="info" color="#fff" size={20} /> 
        </TouchableOpacity>
        ), 
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      names: [],
      text : ''
    };
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM buku', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          names: temp,
        });
      });
    });
  }

  handleBackButton = () => {
    if (this.props.navigation.isFocused()) {
     Alert.alert(
      'Keluar',
       'Apakah anda yakin ingin keluar?', [{
         text: 'Batal',
         onPress: () => console.log('Cancel Pressed'),
         style: 'cancel'
       }, {
         text: 'Ya',
         onPress: () => BackHandler.exitApp()
       }, ], {
         cancelable: false
       }
       )
     return true;
   }
   
 } 

 componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
}

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}
render() {
  return (
   <View style={styles.appC}>
   <View>
   <View style={styles.searchSection}>
   <Icon style={styles.searchIcon} name="search" size={20} /> 
   <TextInput style = {styles.input}
   underlineColorAndroid = "transparent"
   placeholder = "Cari Pasal ..."
   placeholderTextColor = "#ccc"
   autoCapitalize = "none"
   onChangeText={(text) => this.setState({text})}
   onSubmitEditing = {() => {
    this.props.navigation.push('SearchPasalDetails', {
      keyword: this.state.text
    });
  }}
  />
  </View>
  </View>
  <ScrollView>
  {
   this.state.names.map((item, index) => (
    <TouchableOpacity
    key = {item.id_buku}
    style = {styles.container}
    onPress={() => {
      this.props.navigation.push('BabDetails', {
        itemId: item.id_buku,
        title: item.nama_buku,
      });
    }}
    >
    <Text style = {styles.text}>
    {item.nama_buku}
    </Text>
    <Text style = {styles.desc}>
    {item.deskripsi}
    </Text>
    </TouchableOpacity>
    ))
 }

 </ScrollView>
 </View>
 );
}
}
class BabDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Judul'),
      headerStyle: {
        backgroundColor: '#f03434',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        textTransform : 'capitalize'
      },
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      bab: [],
    };
    const { navigation } = this.props;
    var id_buku = navigation.getParam('itemId', '0');
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM bab WHERE id_buku=?', [id_buku], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          bab: temp,
        });
      });
    });
  }
  render() {
    const { navigation } = this.props;
    if (!this.state.bab.length&&navigation.getParam('itemId')!=1) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#ce2b2b" /> 
          <Text>Memuat ...</Text>
          </View>
          );
    }
    if(navigation.getParam('itemId')==1){
      return (
        <ScrollView>
        <View style={styles.textContainer}>
        <Text style={{textAlign:'center',fontWeight:'bold',fontWeight:'bold',fontSize:20,color:'#222'}}>PEMBUKAAN</Text>
        <Text style={{textAlign:'justify',marginTop:5}}>Berdasarkan pada isinya, hukum dapat dibagi menjadi 2, yaitu: {"\n"}{"\n"}
        1. Hukum privat dan{"\n"}
        2. Hukum publik (C.S.T Kansil).{"\n"}{"\n"}

        Hukum privat adalah hukum yg mengatur hubungan orang perorang, dan hukum publik adalah hukum yang mengatur hubungan antara negara dengan warga negaranya.
        {"\n"}
        Hukum pidana merupakan bagian dari hukum publik. Hukum pidana terbagi menjadi dua bagian, yaitu hukum pidana materiil dan hukum pidana formil. Hukum pidana materiil mengatur tentang penentuan tindak pidana, pelaku tindak pidana, dan pidana (sanksi). Di Indonesia, pengaturan hukum pidana materiil diatur dalam Kitab Undang-undang Hukum Pidana (KUHP). Hukum pidana formil mengatur tentang pelaksanaan hukum pidana materiil. Di Indonesia, pengaturan hukum pidana formil telah disahkan dengan UU nomor 8 tahun 1981 tentang hukum acara pidana (KUHAP).</Text>
        </View>
        </ScrollView>
        );
    }else{
      return (
       <View>
       <ScrollView>
       {
         this.state.bab.map((item, index) => (
          <TouchableOpacity
          key = {item.id_bab}
          style = {styles.containerBab}
          onPress={() => {
            this.props.navigation.push('PasalDetails', {
              itemId: item.id_bab,
              title: item.nama_bab,
            });
          }}
          >
          <Text style = {styles.textBab}>
          BAB {item.nama_bab}
          </Text>
          <Text style = {styles.desc}>
          {item.deskripsi_bab}
          </Text>
          </TouchableOpacity>
          ))
       }
       </ScrollView>
       </View>
       );
    }
  }
}

class PasalDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "BAB "+navigation.getParam('title', 'Judul').toUpperCase(),
      headerStyle: {
        backgroundColor: '#222',
        textTransform : 'uppercase'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        textTransform : 'uppercase'
      },
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      pasal: [],
    };
    const { navigation } = this.props;
    var id_bab = navigation.getParam('itemId', '0');
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM pasal WHERE id_bab=?', [id_bab], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          pasal: temp,
        });
      });
    });
  };
  render() {
    if (!this.state.pasal.length) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#ce2b2b" /> 
          <Text>Memuat ...</Text>
          </View>
          );
    }
    const { navigation } = this.props;
    return (
     <View>
     <ScrollView>
     {
       this.state.pasal.map((item, index) => (
        <TouchableOpacity
        key = {item.id_pasal}
        style = {styles.containerPasal}
        onPress={() => {
          this.props.navigation.push('IsiPasalDetails', {
            itemId: item.id_pasal,
            title: item.pasal,
          });
        }}
        >
        <Text style = {styles.text}>
        {item.pasal}
        </Text>
        <Text>
        {item.isi_pasal.split('\\n').join("\n")}
        </Text>

        </TouchableOpacity>
        ))
     }
     </ScrollView>
     </View>
     );
  }
}
class IsiPasalDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', 'Judul'),
      headerStyle: {
        backgroundColor: '#222',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        textTransform : 'capitalize'
      },
      headerRight: () => (  
        <TouchableOpacity onPress={navigation.getParam('downloadPDF')}
        style={{right: Platform.OS === 'ios' ? Dimensions.get("window").height < 667 ?  '10%' : '5%' : '25%', backgroundColor: 'transparent', paddingLeft: 15}}>
        <Icon name="get-app" color="#fff" size={20} /> 
        </TouchableOpacity>
        ), 
    };
  };
  componentDidMount() {
    this.props.navigation.setParams({ downloadPDF: this.askPermission.bind(this) });
  }
  constructor(props) {
    super(props);

    this.state = {
      nama_pasal : '',
      isi_pasal : '',
      filePath : ''
    };
    const { navigation } = this.props;
    var id_pasal = navigation.getParam('itemId', '0');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pasal INNER JOIN bab ON pasal.id_bab = bab.id_bab INNER JOIN buku ON bab.id_buku = buku.id_buku WHERE id_pasal = ?',
        [id_pasal],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            this.setState({
              nama_pasal: results.rows.item(0).pasal,
              isi_pasal: results.rows.item(0).isi_pasal,
              nama_buku: results.rows.item(0).nama_buku,
              nama_bab: results.rows.item(0).nama_bab,
            });
          } else {
            alert('No Pasal found');
            this.setState({
              pasalData: '',
            });
          }
        }
        );
    });
  }
  askPermission() {
    var that = this;
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'CameraExample App External Storage Write Permission',
            message:
            'CameraExample App needs access to Storage data in your SD Card ',
          }
          );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //If WRITE_EXTERNAL_STORAGE Permission is granted
          //changing the state to show Create PDF option
          that.createPDF();
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        alert('Write permission err', err);
        console.warn(err);
      }
    }
    //Calling the External Write permission function
    if (Platform.OS === 'android') {
      requestExternalWritePermission();
    } else {
     this.createPDF();
   }
 }
 async createPDF() {
  let options = {
      //Content to print
      html:
      '<h1 style="text-align: center;"><strong>'+this.state.nama_pasal+' KUHP</strong></h1><p style="text-align: justify;">'+this.state.isi_pasal.split('\\n').join("<br>")+'</p>',
      //File Name
      fileName: this.state.nama_pasal,
      //File directory
      directory: 'docs',
    };
    let file = await RNHTMLtoPDF.convert(options);
    Alert.alert('Berhasil','File berhasil disimpan di '+file.filePath);
    this.setState({filePath:file.filePath});
  }
  _downloadPDF = () => {
    this.askPermission.bind(this);
  };
  render() {
    const { navigation } = this.props;
    return (
     <View  style = {styles.textContainer}>
     <View style = {styles.pasalContainer}>
     <Text style = {styles.detailTitle}>Buku</Text>
     <Text>{this.state.nama_buku}</Text>
     </View>
     <View style = {styles.pasalContainer}>
     <Text style = {styles.detailTitle}>Bab</Text>
     <Text>BAB {this.state.nama_bab}</Text>
     </View>
     <View style = {styles.pasalContainer}>
     <Text style = {styles.detailTitle}>Pasal</Text>
     <Text>{this.state.nama_pasal}</Text>
     </View>
     <View style = {styles.pasalContainer}>
     <Text style = {styles.detailTitle}>Isi Pasal</Text>
     <Text style = {styles.textJustify}>
     {this.state.isi_pasal.split('\\n').join("\n")}
     </Text>
     </View>
     </View>
     );
  }
}

class SearchPasalDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Pencarian",
      headerStyle: {
        backgroundColor: '#222',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        textTransform : 'capitalize'
      },
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      pasal: [],
      status : 'mencari'
    };
    const { navigation } = this.props;
    var keyword = navigation.getParam('keyword', '0');
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM pasal WHERE isi_pasal LIKE '%"+keyword+"%' OR pasal LIKE '%"+keyword+"%'", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          console.log(results.rows.item(i));
          temp.push(results.rows.item(i));
        }
        this.setState({
          pasal: temp,
          status: 'beres',
        });
      });
    });
  };
  render() {
    const { navigation } = this.props;
    if (this.state.status=='mencari') {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#ce2b2b" /> 
          <Text>Mencari ...</Text>
          </View>
          );
    }
    return (
     <View>
     <View style={styles.searchSection}>
     <Icon style={styles.searchIcon} name="search" size={20} /> 
     <TextInput style = {styles.input}
     underlineColorAndroid = "transparent"
     placeholder = "Cari Pasal ..."
     placeholderTextColor = "#ccc"
     autoCapitalize = "none"
     onChangeText={(text) => this.setState({text})}
     onSubmitEditing = {() => {
      this.props.navigation.push('SearchPasalDetails', {
        keyword: this.state.text
      });
    }}
    />
    </View>
    <ScrollView>
    <Text style={styles.textResult}>Ditemukan {this.state.pasal.length} Hasil</Text>
    {
     this.state.pasal.map((item, index) => (
      <TouchableOpacity
      key = {item.id_pasal}
      style = {styles.containerPasal}
      onPress={() => {
        this.props.navigation.push('IsiPasalDetails', {
          itemId: item.id_pasal,
          title: item.pasal,
        });
      }}
      >
      <Text style = {styles.text}>
      {item.pasal}
      </Text>
      <Text>
      {item.isi_pasal.split('\\n').join("\n")}
      </Text>

      </TouchableOpacity>
      ))
   }
   </ScrollView>
   </View>
   );
  }
}
class AboutScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Tentang Aplikasi",
      headerStyle: {
        backgroundColor: '#ce2b2b',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        textTransform : 'capitalize'
      },
    };
  };
  render() {
    const { navigation } = this.props;
    return (
     <View style={styles.textContainer}>
     <Image
     source={require('./img/logo.png')}
     style={{
      width: 90,
      height: 90,
      alignSelf:'center'
    }}
    />
    <Text style={{alignSelf:'center',fontSize:17,fontWeight:'bold',marginTop:5}}>APLIKASI KUHP v1.0</Text>
    <Text style={{alignSelf:'center',marginTop:10}}>Febri Faisal</Text>
    <Text style={{alignSelf:'center'}}>A2.1300032</Text>
    <Text style={{alignSelf:'center',fontWeight:'bold',}}>STMIK Sumedang</Text>
    <Text style={{alignSelf:'center',textAlign:'center'}}>Jl. Angkrek Situ No.19, Situ, Kec. Sumedang Utara, Kabupaten Sumedang, Jawa Barat 45621</Text>
    </View>
    );
  }
}
const AppNavigator = createStackNavigator(
{
  Home: HomeScreen,
  BabDetails: BabDetailsScreen,
  PasalDetails: PasalDetailsScreen,
  IsiPasalDetails: IsiPasalDetailsScreen,
  SearchPasalDetails: SearchPasalDetailsScreen,
  About: AboutScreen,
},
{
  initialRouteName: 'Home',
}
);
const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create ({
 container: {
  padding: 30,
  marginTop: 3,
  borderRadius : 10,
  backgroundColor: '#e8ecf1',
  marginLeft : 10,
  marginRight : 10
},
containerBab: {
  padding: 20,
  marginTop: 5,
  borderRadius : 10,
  backgroundColor: '#e8ecf1',
  marginLeft : 10,
  marginRight : 10
},
containerPasal: {
  padding: 20,
  marginTop: 5,
  backgroundColor: '#e8ecf1'
},
text: {
  textTransform : 'uppercase',
  fontWeight : 'bold',
  fontSize : 20,
  color: '#ce2b2b'
},
textBab: {
  textTransform : 'uppercase',
  fontWeight : 'bold',
  fontSize : 20,
  color: '#222'
},
desc: {
  fontWeight : '300'
},
input: {
  margin: 15,
  height: 40,
  borderColor: '#ccc',
  borderWidth: 1,
  padding : 12,
  borderRadius : 30,
  width : '100%',
  position : 'absolute',
  alignSelf : 'center',
},
searchSection:{
  position : 'relative',
  height: 65,
  paddingLeft : 10,
  paddingRight : 10
},
searchIcon:{
  position : 'absolute',
  right : 20,
  marginTop : 24,
  color : "#ce2b2b"
},
textContainer:{
  padding:20
},
pasalContainer:{
  marginBottom:10
},
detailTitle:{
  color : "#ce2b2b",
  fontWeight : "bold",
  fontSize : 15
},
textJustify:{
  textAlign : 'justify'
},
textResult:{
  paddingLeft:20,
  paddingRight:20,
  paddingBottom : 5
}
})


export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}  