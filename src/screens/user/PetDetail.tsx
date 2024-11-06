import React, {useEffect, useContext, useState} from 'react';
import { View, Text, StyleSheet, Modal, Image, ImageBackground, ScrollView } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../../styles/colors';
import { AuthContext } from '../../utils/AuthContext';
import ButtonComponent from '../../components/Button';
import { Picker } from '@react-native-picker/picker';

type Pet = {
  id: number;
  name: string;
  breed: string;
  age: number;
  owner: string;
};

type RootStackParamList = {
  PetDetail: { pet: Pet };
};

type PetDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'PetDetail'>;
  navigation: StackNavigationProp<RootStackParamList, 'PetDetail'>;
};

const PetDetail: React.FC<PetDetailScreenProps> = ({ route }) => {
  const { pet } = route.params.pet;
  const petProfile = pet.profile ? pet.profile : '';
  const { authUser } = useContext(AuthContext);
  const [guestUser, setGuestUser] = useState<boolean>(false);
  const [RFIDButton, setRFIDButton] = useState<boolean>(false);
  const [lostPetButton, setLostPetButton] = useState<boolean>(false);
  const [lostStatus, setLostStatus] = useState<boolean>(false);
  const [lostPetId, setLostPetId] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalRFIDVisible, setRFIDModalVisible] = useState<boolean>(false);
  const [modalPetTransferVisible, setModalPetTransferVisible] = useState<boolean>(false);
  const [modalPetFoundVisible, setModalPetFoundVisible] = useState<boolean>(false);
  const [note, setNote] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newOwnerError, setNewOwnerError] = useState(false);
  const [RFID, setRFID] = useState('');
  const [rfidError, setRfidError] = useState(false);

  const [lostDate, setLostDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [lostTime, setLostTime] = useState(new Date());
  const [openTimePicker, setOpenTimePicker] = useState(false);

  // Founder inputs -----------------------------------------------
  const [founderId, setFounderId] = useState('');
  const [founderNote, setFounderNote] = useState('');

  const Locations = [
    {
        "state": "California",
        "country": "usa",
        "cities": [
            "Alameda",
            "Alpine",
            "Amador",
            "Butte",
            "Calaveras",
            "Colusa",
            "Contra Costa",
            "Del Norte",
            "El Dorado",
            "Fresno",
            "Glenn",
            "Humboldt",
            "Imperial",
            "Inyo",
            "Kern",
            "Kings",
            "Lake",
            "Lassen",
            "Los Angeles",
            "Madera",
            "Marin",
            "Mariposa",
            "Mendocino",
            "Merced",
            "Modoc",
            "Mono",
            "Monterey",
            "Napa",
            "Nevada",
            "Orange",
            "Placer",
            "Plumas",
            "Riverside",
            "Sacramento",
            "San Benito",
            "San Bernardino",
            "San Diego",
            "San Francisco",
            "San Joaquin",
            "San Luis Obispo",
            "San Mateo",
            "Santa Barbara",
            "Santa Clara",
            "Santa Cruz",
            "Shasta",
            "Sierra",
            "Siskiyou",
            "Solano",
            "Sonoma",
            "Stanislaus",
            "Sutter",
            "Tehama",
            "Trinity",
            "Tulare",
            "Tuolumne",
            "Ventura",
            "Yolo",
            "Yuba"
        ]
    },
    {
        "state": "Arizona",
        "country": "usa",
        "cities": [
            "Apache",
            "Cochise",
            "Coconino",
            "Gila",
            "Graham",
            "Greenlee",
            "La Paz",
            "Maricopa",
            "Mohave",
            "Navajo",
            "Pima",
            "Pinal",
            "Santa Cruz",
            "Yavapai",
            "Yuma"
        ]
    },    
    {
        "state": "Aguascalientes",
        "country": "maxico",
        "cities": [
            "Aguascalienes",
            "Asientos",
            "Calvillo",
            "Cosío",
            "El Llano",
            "Jesús María",
            "Pabellón de Arteaga",
            "Rincón de Romos",
            "San Francisco de los Romo",
            "San José de Gracia",
            "Tepezalá"
        ]
    },
    {
        "state": "Baja California",
        "country": "maxico",
        "cities": [
            "Ensenada",
            "Mexicali",
            "Playas de Rosarito",
            "Tecate",
            "Tijuana"
        ]
    },
    {
        "state": "Baja California Sur",
        "country": "maxico",
        "cities": [
            "Comundu",
            "La Paz",
            "Loreto",
            "Los Cabos",
            "Mulege"
        ]
    },
    {
        "state": "Campeche",
        "country": "maxico",
        "cities": [
            "Calakmul",
            "Calkini",
            "Campeche",
            "Candelaria",
            "Carmen",
            "Champoton",
            "Escarcega",
            "Hecelchakan",
            "Hopelchen",
            "Palizada",
            "Tenabo"
        ]
    },
    {
        "state": "Chiapas",
        "country": "maxico",
        "cities": [
            "Acacoyagua",
            "Acala",
            "Acapetahua",
            "Aldama",
            "Altamirano",
            "Amatán",
            "Amatenango de la Frontera",
            "Amatenango del Valle",
            "Angel Albino Corzo",
            "Arriaga",
            "Bejucal de Ocampo",
            "Bella Vista",
            "Benemérito de las Américas",
            "Berriozábal",
            "Bochil",
            "Cacahoatán",
            "Catazajá",
            "Chalchihuitán",
            "Chamula",
            "Chanal",
            "Chapultenango",
            "Chenalhó",
            "Chiapa de Corzo",
            "Chiapilla",
            "Chicoasén",
            "Chicomuselo",
            "Chilón",
            "Cintalapa",
            "Coapilla",
            "Comitán de Domínguez",
            "Copainalá",
            "El Bosque",
            "El Porvenir",
            "Escuintla",
            "Francisco León",
            "Frontera Comalapa",
            "Frontera Hidalgo",
            "Huehuetán",
            "Huitiupán",
            "Huixtán",
            "Huixtla",
            "Ixhuatán",
            "Ixtacomitán",
            "Ixtapa",
            "Ixtapangajoya",
            "Jiquipilas",
            "Jitotoló",
            "Juárez",
            "La Concordia",
            "La Grandeza",
            "La Independencia",
            "La Libertad",
            "La Trinitaria",
            "Larráinzar",
            "Las Margaritas",
            "Las Rosas",
            "Mapastepec",
            "Maravilla Tenejapa",
            "Marqués de Comillas",
            "Mazapa de Madero",
            "Mazatán",
            "Metapa de Domínguez",
            "Mitontic",
            "Montecristo de Guerrero",
            "Motozintla",
            "Nicolás Ruíz",
            "Ocosingo",
            "Ocotepec",
            "Ocozocoautla de Espinosa",
            "Ostuacán",
            "Osumacinta",
            "Oxchuc",
            "Palenque",
            "Pantelhó",
            "Pantepec",
            "Pichucalco",
            "Pijijiapan",
            "Pueblo Nuevo Solistahuacán",
            "Rayón",
            "Reforma",
            "Sabanilla",
            "Salto de Agua",
            "San Andrés Duraznal",
            "San Cristóbal de las Casas",
            "San Fernando",
            "San Juan Cancuc",
            "San Lucas",
            "Santiago el Pinar",
            "Siltepec",
            "Simojovel",
            "Sitalá",
            "Socoltenango",
            "Solosuchiapa",
            "Soyaló",
            "Suchiapa",
            "Suchiate",
            "Sunuapa",
            "Tapachula",
            "Tapalapa",
            "Tapilula",
            "Tecpatán",
            "Tenejapa",
            "Teopisca",
            "Tila",
            "Tonalá",
            "Totolapa",
            "Tumbalá",
            "Tuxtla Chico",
            "Tuxtla Gutiérrez",
            "Tuzantán",
            "Tzimol",
            "Unión Juárez",
            "Venustiano Carranza",
            "Villa Comaltitlán",
            "Villa Corzo",
            "Villaflores",
            "Yajalón",
            "Zinacantán"
        ]
    },
    {
        "state": "Chihuahua",
        "country": "maxico",
        "cities": [
            "Ahumada",
            "Aldama",
            "Allende",
            "Aquiles Serdán",
            "Ascensión",
            "Bachíniva",
            "Balleza",
            "Batopilas",
            "Bocoyna",
            "Buenaventura",
            "Camargo",
            "Carichí",
            "Casas Grandes",
            "Chihuahua",
            "Chínipas",
            "Coronado",
            "Coyame del Sotol",
            "Cuauhtémoc",
            "Cusihuiriachi",
            "Delicias",
            "Dr. Belisario Domínguez",
            "El Tule",
            "Galeana",
            "Gómez Farías",
            "Gran Morelos",
            "Guachochi",
            "Guadalupe",
            "Guadalupe y Calvo",
            "Guazapares",
            "Guerrero",
            "Hidalgo del Parral",
            "Huejotitán",
            "Ignacio Zaragoza",
            "Janos",
            "Jiménez",
            "Juárez",
            "Julimes",
            "La Cruz",
            "López",
            "Madera",
            "Maguarichi",
            "Manuel Benavides",
            "Matachí",
            "Matamoros",
            "Meoqui",
            "Morelos",
            "Moris",
            "Namiquipa",
            "Nonoava",
            "Nuevo Casas Grandes",
            "Ocampo",
            "Ojinaga",
            "Praxedis G. Guerrero",
            "Riva Palacio",
            "Rosales",
            "Rosario",
            "San Francisco de Boria",
            "San Francisco de Conchos",
            "San Francisco del Oro",
            "Santa Bárbara",
            "Santa Isabel",
            "Satevó",
            "Saucillo",
            "Temósachic",
            "Urique",
            "Uruachi",
            "Valle de Zaragoza"
        ]
    },
    {
        "state": "Ciudad de México",
        "country": "maxico",
        "cities": [
            "Álvaro Obregón",
            "Azcapotzalco",
            "Benito Juárez",
            "Coyoacán",
            "Cuajimalpa de Morelos",
            "Cuauhtémoc",
            "Gustavo A. Madero",
            "Iztacalco",
            "Iztapalapa",
            "La Magdalena Contreras",
            "Miguel Hidalgo",
            "Milpa Alta",
            "Tláhuac",
            "Tlalpan",
            "Venustiano Carranza",
            "Xochimilco"
        ]
    },
    {
        "state": "Coahuila",
        "country": "maxico",
        "cities": [
            "Abasolo",
            "Acuña",
            "Allende",
            "Arteaga",
            "Candela",
            "Castaños",
            "Cuatrociénegas",
            "Escobedo",
            "Francisco I. Madero",
            "Frontera",
            "General Cepeda",
            "Guerrero",
            "Hidalgo",
            "Jiménez",
            "Juárez",
            "Lamadrid",
            "Matamoros",
            "Monclova",
            "Morelos",
            "Múzquiz",
            "Nadadores",
            "Nava",
            "Ocampo",
            "Parras",
            "Piedras Negras",
            "Progreso",
            "Ramos Arizpe",
            "Sabinas",
            "Sacramento",
            "Saltillo",
            "San Buenaventura",
            "San Juan de Sabinas",
            "San Pedro",
            "Sierra Mojada",
            "Torreón",
            "Viesca",
            "Villa Unión",
            "Zaragoza"
        ]
    },
    {
        "state": "Colima",
        "country": "maxico",
        "cities": [
            "Armería",
            "Colima",
            "Comala",
            "Coquimatlán",
            "Cuauhtémoc",
            "Ixtlahuacán",
            "Manzanillo",
            "Minatitlán",
            "Tecomán",
            "Villa de Álvarez"
        ]
    },
    {
        "state": "Durango",
        "country": "maxico",
        "cities": [
            "Canatlán",
            "Canelas",
            "Coneto de Comonfort",
            "Cuencamé",
            "Durango",
            "El Oro",
            "General Simón Bolívar",
            "Gómez Palacio",
            "Guadalupe Victoria",
            "Guanacevi",
            "Hidalgo",
            "Indé",
            "Lerdo",
            "Mapimí",
            "Mezquital",
            "Nazas",
            "Nombre de Dios",
            "Nuevo Ideal",
            "Ocampo",
            "Otáez",
            "Pánuco de Coronado",
            "Peñón Blanco",
            "Poanas",
            "Pueblo Nuevo",
            "Rodeo",
            "San Bernardo",
            "San Dimas",
            "San Juan de Guadalupe",
            "San Juan del Río",
            "San Luis del Cordero",
            "San Pedro del Gallo",
            "Santa Clara",
            "Santiago Papasquiaro",
            "Súchil",
            "Tamazula",
            "Tepehuanes",
            "Tlahualilo",
            "Topia",
            "Vicente Guerrero"
        ]
    },
    {
        "state": "Estado de México",
        "country": "maxico",
        "cities": [
            "Acambay",
            "Acolman",
            "Áculco",
            "Almoloya de Alquisiras",
            "Almoloya de Juárez",
            "Almoloya del Río",
            "Amanalco",
            "Amatepec",
            "Amecameca",
            "Apaco",
            "Atenco",
            "Atizapán",
            "Atizapán de Zaragoza",
            "Atlacomulco",
            "Atlautla",
            "Axapusco",
            "Ayapango",
            "Calimaya",
            "Capulhuac",
            "Chalco",
            "Chapa de Mota",
            "Chapultepec",
            "Chiautla",
            "Chicoloapan",
            "Chiconcuac",
            "Chimalhuacán",
            "Coacalco de Berriozábal",
            "Coatepec Harinas",
            "Cocotitlán",
            "Covotepec",
            "Cuautitlán",
            "Cuautitlán Izcalli",
            "Donato Guerra",
            "Ecatepec de Morelos",
            "Ecatzingo",
            "El Oro",
            "Huehuetoca",
            "Hueypoxtla",
            "Huixquilucan",
            "Isidro Fabela",
            "Ixtapaluca",
            "Ixtapan de la Sal",
            "Ixtapan del Oro",
            "Ixtlahuaca",
            "Jaltenco",
            "Jilotepec",
            "Jilotzingo",
            "Jiquipilco",
            "Jocotitlán",
            "Joquicingo",
            "Juchitepec",
            "La Paz",
            "Lerma",
            "Luvianos",
            "Malinalco",
            "Melchor Ocampo",
            "Metepec",
            "Mexicaltzingo",
            "Morelos",
            "Naucalpan de Juárez",
            "Nextlalpan",
            "Nezahualcoyotl",
            "Nicolás Romero",
            "Nopaltepec",
            "Ocoyoacac",
            "Ocuilan",
            "Otumba",
            "Otzoloapan",
            "Otzolotepec",
            "Ozumba",
            "Papalotla",
            "Polotitlán",
            "Rayón",
            "San Antonio la Isla",
            "San Felipe del Progreso",
            "San José del Rincón",
            "San Martín de las Pirámides",
            "San Mateo Atenco",
            "San Simón de Guerrero",
            "Santo Tomás",
            "Soyaniquilpan de Juárez",
            "Sultepec",
            "Tecamac",
            "Tejupilco",
            "Temamatla",
            "Temascalapa",
            "Temascalcingo",
            "Temascaltepec",
            "Temoava",
            "Tenancingo",
            "Tenango del Aire",
            "Tenango del Valle",
            "Teoloyucán",
            "Teotihuacán",
            "Tepetlaoxtoc",
            "Tepetlixpa",
            "Tepotzotlán",
            "Tequixquiac",
            "Texcaltitlán",
            "Texcalyacac",
            "Texcoco",
            "Tezoyuca",
            "Tianguistenco",
            "Timilpan",
            "Tlalmanalco",
            "Tlalnepantla de Baz",
            "Tlatlava",
            "Toluca",
            "Tonanitla",
            "Tonatico",
            "Tultepec",
            "Tultitlán",
            "Valle de Bravo",
            "Valle de Chalco Solidaridad",
            "Villa de Allende",
            "Villa del Carbón",
            "Villa Guerrero",
            "Villa Victoria",
            "Xalatlaco",
            "Xonacatlán",
            "Zacazonapan",
            "Zacualpan",
            "Zinacantepec",
            "Zumpahuacán",
            "Zumpango"
        ]
    },
    {
        "state": "Guanajuato",
        "country": "maxico",
        "cities": [
            "Abasolo",
            "Acambaro",
            "Allende",
            "Apaseo el Alto",
            "Apaseo el Grande",
            "Atarjea",
            "Celaya",
            "Comonfort",
            "Coroneo",
            "Cortazar",
            "Cueramaro",
            "Doctor Mora",
            "Dolores Hidalgo",
            "Guanajuato",
            "Huanimaro",
            "Irapuato",
            "Jaral del Progreso",
            "Leon",
            "Manuel Doblado",
            "Moroleon",
            "Ocampo",
            "Penjamo",
            "Pueblo Nuevo",
            "Purisima del Rincon",
            "Romita",
            "Salamanca",
            "Salvatierra",
            "San Diego de la Union",
            "San Felipe",
            "San Francisco del Rincon",
            "San Jose Iturbide",
            "San Luis de la Plaza",
            "Santa Catarina",
            "Santa Cruz de Juventino Rosas",
            "Santiago Maravatio",
            "Silao",
            "Tarandacuao",
            "Tarimoro",
            "Tierra Blanca",
            "Uriangato",
            "Valle de Santiago",
            "Victoria",
            "Villagran",
            "Xichu",
            "Yuriria"
        ]
    },
    {
        "state": "Guerrero",
        "country": "maxico",
        "cities": [
            "Acapulco de Juárez",
            "Acatepec",
            "Ahuacuotzingo",
            "Ajuchitlán del Progreso",
            "Alcozauca de Guerrero",
            "Ароуеса",
            "Apaxtla",
            "Arcelia",
            "Atenango del Río",
            "Atlamajalcingo del Monte",
            "Atlixtac",
            "Atoyac de Álvarez",
            "Ayutla de los Libres",
            "Azoyú",
            "Benito Juárez",
            "Buenavista de Cuéllar",
            "Chilapa de Álvarez",
            "Chilpancingo de los Bravo",
            "Coahuayutla de José María Izazaga",
            "Cochoapa el Grande",
            "Cocula",
            "Copala",
            "Copalillo",
            "Copanatoyac",
            "Coyuca de Benitez",
            "Coyuca de Catalán",
            "Cuajinicuilapa",
            "Cualác",
            "Cuautepec",
            "Cuetzala del Progreso",
            "Cutzamala de Pinzón",
            "Eduardo Neri",
            "Florencio Villarreal",
            "General Canuto A. Neri",
            "General Heliodoro Castillo",
            "Huamuxtitlán",
            "Huitzuco de los Figueroa",
            "Iguala de la Independencia",
            "Igualapa",
            "Iliatenco",
            "Ixcateopan de Cuauhtémoc",
            "José Joaquin de Herrera",
            "Juan R. Escudero",
            "Juchitán",
            "La Unión de Isidoro Montes de Oca",
            "Leonardo Bravo",
            "Malinaltepec",
            "Marquelia",
            "Mártir de Cuilapan",
            "Metlatónoc",
            "Mochitlán",
            "Olinalá",
            "Ometepec",
            "Pedro Ascencio Alquisiras",
            "Petatlán",
            "Pilcava",
            "Pungarabato",
            "Quechultenango",
            "San Luis Acatlán",
            "San Marcos",
            "San Miguel Totolapan",
            "Taxco de Alarcón",
            "Tecoanapa",
            "Técpan de Galeana",
            "Teloloapan",
            "Tepecoacuilco de Trujano",
            "Tetipac",
            "Tixtla de Guerrero",
            "Tlacoachistlahuaca",
            "Tlacoapa",
            "Tlalchapa",
            "Tlalixtaquilla de Maldonado",
            "Tlapa de Comonfort",
            "Tlapehuala",
            "Xalpatláhuac",
            "Xochihuehuetlán",
            "Xochistlahuaca",
            "Zapotitlán Tablas",
            "Zihuatanejo de Azueta",
            "Zirándaro",
            "Zitlala"
        ]
    },
    {
        "state": "Hidalgo",
        "country": "maxico",
        "cities": [
            "Acatlán",
            "Acaxochitlán",
            "Actopan",
            "Agua Blanca de Iturbide",
            "Ajacuba",
            "Alfajayucan",
            "Almoloya",
            "Apan",
            "Atitalaquia",
            "Atlapexco",
            "Atotonilco de Tula",
            "Atotonilco el Grande",
            "Calnali",
            "Cardonal",
            "Chapantongo",
            "Chapulhuacán",
            "Chilcuautla",
            "Cuautepec de Hinojosa",
            "El Arenal",
            "Eloxochitlán",
            "Emiliano Zapata",
            "Epazoyucan",
            "Francisco I. Madero",
            "Huasca de Ocampo",
            "Huautla",
            "Huazalingo",
            "Huehuetla",
            "Huejutla de Reyes",
            "Huichapan",
            "Ixmiquilpan",
            "Jacala de Ledezma",
            "Jaltocan",
            "Juárez Hidalgo",
            "La Misión",
            "Lolotla",
            "Metepec",
            "Metztitlán",
            "Mineral de la Reforma",
            "Mineral del Chico",
            "Mineral del Monte",
            "Mixquiahuala de Juárez",
            "Molango de Escamilla",
            "Nicolás Flores",
            "Nopala de Villagran",
            "Omitlán de Juárez",
            "Pachuca de Soto",
            "Pacula",
            "Pisaflores",
            "Progreso de Obregón",
            "San Agustín Metzquititlán",
            "San Agustín Tlaxiaca",
            "San Bartolo Tutotepec",
            "San Felipe Orizatlán",
            "San Salvador",
            "Santiago de Anaya",
            "Santiago Tulantepec de Lugo Guerrero",
            "Singuilucan",
            "Tasquillo",
            "Tecozautla",
            "Tenango de Doria",
            "Tepeapulco",
            "Tepehuacan de Guerrero",
            "Tepeji del Río de Ocampo",
            "Tepetitlán",
            "Tetepango",
            "Tezontepec de Aldama",
            "Tianguistengo",
            "Tizayuca",
            "Tlahuelilpan",
            "Tlahuiltepa",
            "Tlanalapa",
            "Tlanchinol",
            "Tlaxcoapan",
            "Tolcayuca",
            "Tula de Allende",
            "Tulancingo de Bravo",
            "Villa de Tezontepec",
            "Xochiatipan",
            "Xochicoatlán",
            "Yahualica",
            "Zacualtipán de Ángeles",
            "Zapotlán de Juárez",
            "Zempoala",
            "Zimapán"
        ]
    },
    {
        "state": "Jalisco",
        "country": "maxico",
        "cities": [
            "Acatic",
            "Acatlán de Juárez",
            "Ahualulco de Mercado",
            "Amacueca",
            "Amatitán",
            "Ameca",
            "Arandas",
            "Atemajac de Brizuela",
            "Atengo",
            "Atenguillo",
            "Atotonilco el Alto",
            "Atoyac",
            "Autlán de Navarro",
            "Ayotlán",
            "Ayutla",
            "Bolaños",
            "Cabo Corrientes",
            "Cañadas de Obregón",
            "Casimiro Castillo",
            "Chapala",
            "Chimaltitán",
            "Chiquilistlán",
            "Cihuatlán",
            "Cocula",
            "Colotlán",
            "Concepción de Buenos Aires",
            "Cuautitlán de García Barragán",
            "Cuautla",
            "Cuquío",
            "Degollado",
            "Ejutla",
            "El Arenal",
            "El Grullo",
            "El Limón",
            "El Salto",
            "Encarnación de Díaz",
            "Etzatlán",
            "Gómez Farías",
            "Guachinango",
            "Guadalajara",
            "Hostotipaquillo",
            "Huejúcar",
            "Huejuquilla el Alto",
            "Ixtlahuacán de los Membrillos",
            "Ixtlahuacán del Río",
            "Jalostotitlán",
            "Jamay",
            "Jesús María",
            "Jilotlán de los Dolores",
            "Jocotepec",
            "Juanacatlán",
            "Juchitlán",
            "La Barca",
            "La Huerta",
            "La Manzanilla de la Paz",
            "Lagos de Moreno",
            "Magdalena",
            "Mascota",
            "Mazamitla",
            "Mexticacán",
            "Mezquitic",
            "Mixtlán",
            "Ocotlán",
            "Ojuelos de Jalisco",
            "Pihuamo",
            "Poncitlán",
            "Puerto Vallarta",
            "Quitupan",
            "San Cristóbal de la Barranca",
            "San Diego de Alejandría",
            "San Gabriel",
            "San Ignacio Cerro Gordo",
            "San Juan de los Lagos",
            "San Juanito de Escobedo",
            "San Julián",
            "San Marcos",
            "San Martín de Bolaños",
            "San Martín Hidalgo",
            "San Miguel el Alto",
            "San Sebastián del Oeste",
            "Santa María de los Ángeles",
            "Santa María del Oro",
            "Sayula",
            "Tala",
            "Talpa de Allende",
            "Tamazula de Gordiano",
            "Tapalpa",
            "Tecalitlán",
            "Techaluta de Montenegro",
            "Tecolotlán",
            "Tenamaxtlán",
            "Teocaltiche",
            "Teocuitatlán de Corona",
            "Tepatitlán de Morelos",
            "Tequila",
            "Teuchitlán",
            "Tizapán el Alto",
            "Tlajomulco de Zúñiga",
            "Tlaquepaque",
            "Tolimán",
            "Tomatlán",
            "Tonalá",
            "Tonaya",
            "Tonila",
            "Totatiche",
            "Tototlán",
            "Tuxcacuesco",
            "Tuxcueca",
            "Tuxpan",
            "Unión de San Antonio",
            "Unión de Tula",
            "Valle de Guadalupe",
            "Valle de Juárez",
            "Villa Corona",
            "Villa Guerrero",
            "Villa Hidalgo",
            "Villa Purificación",
            "Yahualica de González Gallo",
            "Zacoalco de Torres",
            "Zapopan",
            "Zapotiltic",
            "Zapotitlán de Vadillo",
            "Zapotlán del Rey",
            "Zapotlán el Grande",
            "Zapotlanejo"
        ]
    },
    {
        "state": "Michoacán",
        "country": "maxico",
        "cities": [
            "Acuitzio",
            "Aguililla",
            "Álvaro Obregón",
            "Angamacutiro",
            "Angangueo",
            "Apatzingán",
            "Aporo",
            "Aquila",
            "Ario",
            "Arteaga",
            "Briseñas",
            "Buenavista",
            "Carácuaro",
            "Charapan",
            "Charo",
            "Chavinda",
            "Cherán",
            "Chilchota",
            "Chinicuila",
            "Chucándiro",
            "Churintzio",
            "Churumuco",
            "Coahuayana",
            "Coalcomán de Vázquez Pallares",
            "Coeneo",
            "Cojumatlán de Régules",
            "Contepec",
            "Copándaro",
            "Cotija",
            "Cuitzeo",
            "Ecuandureo",
            "Epitacio Huerta",
            "Erongarícuaro",
            "Gabriel Zamora",
            "Hidalgo",
            "Huandacareo",
            "Huaniqueo",
            "Huetamo",
            "Huiramba",
            "Indaparapeo",
            "Irimbo",
            "Ixtlán",
            "Jacona",
            "Jiménez",
            "Jiquilpan",
            "Juárez",
            "Jungapeo",
            "La Huacana",
            "La Piedad",
            "Lagunillas",
            "Lázaro Cárdenas",
            "Los Reyes",
            "Madero",
            "Maravatío",
            "Marcos Castellanos",
            "Morelia",
            "Morelos",
            "Múgica",
            "Nahuatzen",
            "Nocupétaro",
            "Nuevo Parangaricutiro",
            "Nuevo Urecho",
            "Numarán",
            "Ocampo",
            "Paiacuarán",
            "Panindícuaro",
            "Paracho",
            "Parácuaro",
            "Pátzcuaro",
            "Penjamillo",
            "Peribán",
            "Purépero",
            "Puruándiro",
            "Queréndaro",
            "Quiroga",
            "Sahuayo",
            "Salvador Escalante",
            "San Lucas",
            "Santa Ana Maya",
            "Senguio",
            "Susupuato",
            "Tacámbaro",
            "Tancítaro",
            "Tangamandapio",
            "Tangancícuaro",
            "Tanhuato",
            "Taretan",
            "Tarímbaro",
            "Tepalcatepec",
            "Tingambato",
            "Tingüindín",
            "Tiquicheo de Nicolás Romero",
            "Tlalpujahua",
            "Tlazazalca",
            "Tocumbo",
            "Tumbiscatío",
            "Turicato",
            "Tuxpan",
            "Tuzantla",
            "Tzintzuntzan",
            "Tzitzio",
            "Uruapan",
            "Venustiano Carranza",
            "Villamar",
            "Vista Hermosa",
            "Yurécuaro",
            "Zacapu",
            "Zamora",
            "Zináparo",
            "Zinapécuaro",
            "Ziracuaretiro",
            "Zitácuaro"
        ]
    },
    {
        "state": "Morelos",
        "country": "maxico",
        "cities": [
            "Amacuzac",
            "Atlatlahucan",
            "Axochiapan",
            "Ayala",
            "Coatlán del Río",
            "Cuautla",
            "Cuernavaca",
            "Emiliano Zapata",
            "Huitzilac",
            "Jantetelco",
            "Jojutla",
            "Jonacatepec",
            "Juitepec",
            "Mazatepec",
            "Miacatlán",
            "Ocuituco",
            "Puente de Ixtla",
            "Temixco",
            "Temoac",
            "Tepalcingo",
            "Tepoztlán",
            "Tetecala",
            "Tetela del Volcán",
            "Tlalnepantla",
            "Tlaltizapán",
            "Tlaquiltenango",
            "Tlayacapan",
            "Totolapan",
            "Xochitepec",
            "Yautepec",
            "Yecapixtla",
            "Yecapixtla",
            "Zacualpan"
        ]
    },
    {
        "state": "Nayarit",
        "country": "maxico",
        "cities": [
            "Acaponeta",
            "Ahuacatlán",
            "Amatlán de Cañas",
            "Bahía de Banderas",
            "Compostela",
            "Del Nayar",
            "Huajicori",
            "Ixtlán del Río",
            "Jala",
            "La Yesca",
            "Rosamorada",
            "Ruíz",
            "San Blas",
            "San Pedro Lagunillas",
            "Santa María del Oro",
            "Santiago Ixcuintla",
            "Tecuala",
            "Tepic",
            "Tuxpan",
            "Xalisco"
        ]
    },
    {
        "state": "Nuevo León",
        "country": "maxico",
        "cities": [
            "Abasolo",
            "Agualeguas",
            "Allende",
            "Anáhuac",
            "Apodaca",
            "Aramberri",
            "Bustamante",
            "Cadereyta Jiménez",
            "Carmen",
            "Cerralvo",
            "China",
            "Ciénega de Flores",
            "Dr. Arroyo",
            "Dr. Coss",
            "Dr. González",
            "Galeana",
            "García",
            "Gral. Bravo",
            "Gral. Escobedo",
            "Gral. Terán",
            "Gral. Treviño",
            "Gral. Zaragoza",
            "Gral. Zuazua",
            "Guadalupe",
            "Hidalgo",
            "Higueras",
            "Hualahuises",
            "Iturbide",
            "Juárez",
            "Lampazos de Naranjo",
            "Linares",
            "Los Aldamas",
            "Los Herreras",
            "Los Ramones",
            "Marín",
            "Melchor Ocampo",
            "Mier y Noriega",
            "Mina",
            "Montemorelos",
            "Monterrey",
            "Parás",
            "Pesquería",
            "Rayones",
            "Sabinas Hidalgo",
            "Salinas Victoria",
            "San Nicolás de los Garza",
            "San Pedro Garza García",
            "Santa Catarina",
            "Santiago",
            "Vallecillo",
            "Villaldama"
        ]
    },
    {
        "state": "Querétaro",
        "country": "maxico",
        "cities": [
            "Amealco de Bonfil",
            "Arroyo Seco",
            "Caderevta de Montes",
            "Colón",
            "Corregidora",
            "El Marqués",
            "Ezequiel Montes",
            "Huimilpan",
            "Jalpan de Serra",
            "Landa de Matamoros",
            "Pedro Escobedo",
            "Peñamiller",
            "Pinal de Amoles",
            "Querétaro",
            "San Joaquín",
            "San Juan del Río",
            "Tequisquiapan",
            "Tolimán"
        ]
    },
    {
        "state": "Quintana Roo",
        "country": "maxico",
        "cities": [
            "Bacalar",
            "Benito Juárez",
            "Cozumel",
            "Felipe Carrillo Puerto",
            "Isla Mujeres",
            "José María Morelos",
            "Lázaro Cárdenas",
            "Othón P. Blanco",
            "Puerto Morelos",
            "Solidaridad",
            "Tulum"
        ]
    },
    {
        "state": "San Luis Potosí",
        "country": "maxico",
        "cities": [
            "Ahualulco",
            "Alaquines",
            "Aquismón",
            "Armadillo de los Infante",
            "Axtla de Terrazas",
            "Cárdenas",
            "Catorce",
            "Cedral",
            "Cerritos",
            "Cerro de San Pedro",
            "Charcas",
            "Ciudad del Maíz",
            "Ciudad Fernández",
            "Ciudad Valles",
            "Coxcatlán",
            "Ebano",
            "El Naranjo",
            "Guadalcázar",
            "Huehuetlán",
            "Lagunillas",
            "Matehuala",
            "Matlapa",
            "Mexquitic de Carmona",
            "Moctezuma",
            "Rayón",
            "Rioverde",
            "Salinas",
            "San Antonio",
            "San Ciro de Acosta",
            "San Luis Potosí",
            "San Martín Chalchicuautla",
            "San Nicolás Tolentino",
            "San Vicente Tancuayalab",
            "Santa Catarina",
            "Santa María del Río",
            "Santo Domingo",
            "Soledad de Graciano Sánchez",
            "Tamasopo",
            "Tamazunchale",
            "Tampacán",
            "Tampamolón Corona",
            "Tamuín",
            "Tancanhuitz",
            "Tanlajás",
            "Tanquián de Escobedo",
            "Tierra Nueva",
            "Vanegas",
            "Venado",
            "Villa de Arista",
            "Villa de Arriaga",
            "Villa de Guadalupe",
            "Villa de la Paz",
            "Villa de Ramos",
            "Villa de Reyes",
            "Villa Hidalgo",
            "Villa Juárez",
            "Xilitla",
            "Zaragoza"
        ]
    },
    {
        "state": "Sinaloa",
        "country": "maxico",
        "cities": [
            "Ahome",
            "Angostura",
            "Badiraguato",
            "Choix",
            "Concordia",
            "Cosalá",
            "Culiacán",
            "El Fuerte",
            "Elota",
            "Escuinapa",
            "Guasave",
            "Mazatlán",
            "Mocorito",
            "Navolato",
            "Rosario",
            "Salvador Alvarado",
            "San Ignacio",
            "Sinaloa"
        ]
    },
    {
        "state": "Tabasco",
        "country": "maxico",
        "cities": [
            "Balancán",
            "Cárdenas",
            "Centla",
            "Centro",
            "Comalcalco",
            "Cunduacán",
            "Emiliano Zapata",
            "Huimanguillo",
            "Jalapa",
            "Jalpa de Méndez",
            "Jonuta",
            "Macuspana",
            "Nacajuca",
            "Paraíso",
            "Tacotalpa",
            "Teapa",
            "Tenosique"
        ]
    },
    {
        "state": "Sonora",
        "country": "maxico",
        "cities": [
            "Aconchi",
            "Agua Prieta",
            "Alamos",
            "Altar",
            "Arivechi",
            "Arizpe",
            "Atil",
            "Bacadéhuachi",
            "Bacanora",
            "Bacerac",
            "Bacoachi",
            "Bácum",
            "Banámichi",
            "Baviácora",
            "Bavispe",
            "Benito Juárez",
            "Beniamín Hill",
            "Caborca",
            "Cajeme",
            "Cananea",
            "Carbó",
            "Cucurpe",
            "Cumpas",
            "Divisaderos",
            "Empalme",
            "Etchojoa",
            "Fronteras",
            "General Plutarco Elías Calles",
            "Granados",
            "Guaymas",
            "Hermosillo",
            "Huachinera",
            "Huásabas",
            "Huatabampo",
            "Huépac",
            "Imuris",
            "La Colorada",
            "Magdalena",
            "Mazatán",
            "Moctezuma",
            "Naco",
            "Nácori Chico",
            "Nacozari de García",
            "Navojoa",
            "Nogales",
            "Onavas",
            "Opodepe",
            "Oquitoa",
            "Pitiquito",
            "Puerto Peñasco",
            "Quiriego",
            "Rayón",
            "Rosario",
            "Sahuaripa",
            "San Felipe de Jesús",
            "San Ignacio Río Muerto",
            "San Javier",
            "San Luis Río Colorado",
            "San Miguel de Horcasitas",
            "San Pedro de la Cueva",
            "Santa Ana",
            "Santa Cruz",
            "Sáric",
            "Soyopa",
            "Suaqui Grande",
            "Tepache",
            "Trincheras",
            "Tubutama",
            "Ures",
            "Villa Hidalgo",
            "Villa Pesqueira",
            "Yécora"
        ]
    },
    {
        "state": "Tamaulipas",
        "country": "maxico",
        "cities": [
            "Abasolo",
            "Aldama",
            "Altamira",
            "Antiguo Morelos",
            "Burgos",
            "Bustamante",
            "Camargo",
            "Casas",
            "Ciudad Madero",
            "Cruillas",
            "El Mante",
            "Gómez Farías",
            "González",
            "Guerrero",
            "Gustavo Díaz Ordaz",
            "Güémez",
            "Hidalgo",
            "Jaumave",
            "Jiménez",
            "Llera",
            "Mainero",
            "Matamoros",
            "Méndez",
            "Mier",
            "Miguel Alemán",
            "Miquihuana",
            "Nuevo Laredo",
            "Nuevo Morelos",
            "Ocampo",
            "Padilla",
            "Palmillas",
            "Reynosa",
            "Río Bravo",
            "San Carlos",
            "San Fernando",
            "San Nicolás",
            "Soto la Marina",
            "Tampico",
            "Tula",
            "Valle Hermoso",
            "Victoria",
            "Villagrán",
            "Xicoténcatl"
        ]
    },
    {
        "state": "Tlaxcala",
        "country": "maxico",
        "cities": [
            "Acuamanala de Miguel Hidalgo",
            "Amaxac de Guerrero",
            "Apetatitlán de Antonio Carvajal",
            "Apizaco",
            "Atlangatepec",
            "Atltzayanca",
            "Benito Juárez",
            "Calpulalpan",
            "Chiautempan",
            "Contla de Juan Cuamatzi",
            "Cuapiaxtla",
            "Cuaxomulco",
            "El Carmen Tequexquitla",
            "Emiliano Zapata",
            "Españita",
            "Huamantla",
            "Hueyotlipan",
            "Ixtacuixtla de Mariano Matamoros",
            "Ixtenco",
            "La Magdalena Tlaltelulco",
            "Lázaro Cárdenas",
            "Mazatecochco de José María Morelos",
            "Muñoz de Domingo Arenas",
            "Nanacamilpa de Mariano Arista",
            "Natívitas",
            "Panotla",
            "Papalotla de Xicohténcatl",
            "San Damián Texóloc",
            "San Francisco Tetlanohcan",
            "San Jerónimo Zacualpan",
            "San José Teacalco",
            "San Juan Huactzinco",
            "San Lorenzo Axocomanitla",
            "San Lucas Tecopilco",
            "San Pablo del Monte",
            "Sanctórum de Lázaro Cárdenas",
            "Santa Ana Nopalucan",
            "Santa Apolonia Teacalco",
            "Santa Catarina Ayometla",
            "Santa Cruz Quilehtla",
            "Santa Cruz Tlaxcala",
            "Santa Isabel Xiloxoxtla",
            "Tenancingo",
            "Teolocholco",
            "Tepetitla de Lardizábal",
            "Tepeyanco",
            "Terrenate",
            "Tetla de la Solidaridad",
            "Tetlatlahuca",
            "Tlaxcala",
            "Tlaxco",
            "Tocatlán",
            "Totolac",
            "Tzompantepec",
            "Xaloztoc",
            "Xaltocan",
            "Xicohtzinco",
            "Yauhquemehcan",
            "Zacatelco",
            "Ziltlaltépec de Trinidad Sánchez Santos"
        ]
    },
    {
        "state": "Veracruz",
        "country": "maxico",
        "cities": [
            "Acajete",
            "Acatlán",
            "Acayucan",
            "Actopan",
            "Acula",
            "Acultzingo",
            "Agua Dulce",
            "Álamo Temapache",
            "Alpatláhuac",
            "Alto Lucero de Gutiérrez Barrios",
            "Altotonga",
            "Alvarado",
            "Amatitlán",
            "Amatlán de los Reyes",
            "Angel R. Cabada",
            "Apazapan",
            "Aquila",
            "Astacinga",
            "Atlahuilco",
            "Atoyac",
            "Atzacan",
            "Atzalan",
            "Ayahualulco",
            "Banderilla",
            "Benito Juárez",
            "Boca del Río",
            "Calcahualco",
            "Camarón de Tejeda",
            "Camerino Z. Mendoza",
            "Carlos A. Carrillo",
            "Carrillo Puerto",
            "Castillo de Teayo",
            "Catemaco",
            "Cazones de Herrera",
            "Cerro Azul",
            "Chacaltianguis",
            "Chalma",
            "Chiconamel",
            "Chiconquiaco",
            "Chicontepec",
            "Chinameca",
            "Chinampa de Gorostiza",
            "Chocamán",
            "Chontla",
            "Chumatlán",
            "Citlaltépetl",
            "Coacoatzintla",
            "Coahuitlán",
            "Coatepec",
            "Coatzacoalcos",
            "Coatzintla",
            "Coetzala",
            "Colipa",
            "Comapa",
            "Córdoba",
            "Cosamaloapan de Carpio",
            "Cosautlán de Carvajal",
            "Coscomatepec",
            "Cosoleacaque",
            "Cotaxtla",
            "Coxquihui",
            "Coyutla",
            "Cuichapa",
            "Cuitláhuac",
            "El Higo",
            "Emiliano Zapata",
            "Espinal",
            "Filomeno Mata",
            "Fortín",
            "Gutiérrez Zamora",
            "Hidalgotitlán",
            "Huatusco",
            "Huayacocotla",
            "Hueyapan de Ocampo",
            "Huiloapan de Cuauhtémoc",
            "Ignacio de la Llave",
            "llamatlán",
            "Isla",
            "Ixcatepec",
            "Ixhuacán de los Reyes",
            "Ixhuatlán de Madero",
            "Ixhuatlán del Café",
            "Ixhuatlán del Sureste",
            "Ixhuatlancillo",
            "Ixmatlahuacan",
            "Ixtaczoquitlán",
            "Jalacingo",
            "Jalcomulco",
            "Jaltipan",
            "Jamapa",
            "Jesús Carranza",
            "Jilotepec",
            "José Azueta",
            "Juan Rodríguez Clara",
            "Juchique de Ferrer",
            "La Antigua",
            "La Perla",
            "Landero y Coss",
            "Las Choapas",
            "Las Minas",
            "Las Vigas de Ramírez",
            "Lerdo de Tejada",
            "Los Reyes",
            "Magdalena",
            "Maltrata",
            "Manlio Fabio Altamirano",
            "Mariano Escobedo",
            "Martínez de la Torre",
            "Mecatlán",
            "Mecayapan",
            "Medellín",
            "Miahuatlán",
            "Minatitlán",
            "Misantla",
            "Mixtla de Altamirano",
            "Moloacán",
            "Nanchital de Lázaro Cárdenas del Río",
            "Naolinco",
            "Naranjal",
            "Naranjos Amatlán",
            "Nautla",
            "Nogales",
            "Oluta",
            "Omealca",
            "Orizaba",
            "Otatitlán",
            "Oteapan",
            "Ozuluama de Mascareñas",
            "Pajapan",
            "Pánuco",
            "Papantla",
            "Paso de Ovejas",
            "Paso del Macho",
            "Perote",
            "Platón Sánchez",
            "Playa Vicente",
            "Poza Rica de Hidalgo",
            "Pueblo Viejo",
            "Puente Nacional",
            "Rafael Delgado",
            "Rafael Lucio",
            "Río Blanco",
            "Saltabarranca",
            "San Andrés Tenejapan",
            "San Andrés Tuxtla",
            "San Juan Evangelista",
            "San Rafael",
            "Santiago Sochiapan",
            "Santiago Tuxtla",
            "Sayula de Alemán",
            "Sochiapa",
            "Soconusco",
            "Soledad Atzompa",
            "Soledad de Doblado",
            "Soteapan",
            "Tamalín",
            "Tamiahua",
            "Tampico Alto",
            "Tancoco",
            "Tantima",
            "Tantoyuca",
            "Tatahuicapan de Juárez",
            "Tatatila",
            "Tecolutla",
            "Tehuipango",
            "Tempoal",
            "Tenampa",
            "Tenochtitlán",
            "Teocelo",
            "Tepatlaxco",
            "Tepetlán",
            "Tepetzintla",
            "Tequila",
            "Texcatepec",
            "Texhuacán",
            "Texistepec",
            "Tezonapa",
            "Tierra Blanca",
            "Tihuatlán",
            "Tlachichilco",
            "Tlacojalpan",
            "Tlacolulan",
            "Tlacotalpan",
            "Tlacotepec de Mejía",
            "Tlalixcoyan",
            "Tlalnelhuayocan",
            "Tlaltetela",
            "Tlapacoyan",
            "Tlaquilpa",
            "Tlilapan",
            "Tomatlán",
            "Tonayán",
            "Totutla",
            "Tres Valles",
            "Tuxpan",
            "Tuxtilla",
            "Ursulo Galván",
            "Uxpanapa",
            "Vega de Alatorre",
            "Veracruz",
            "Villa Aldama",
            "Xalapa",
            "Xico",
            "Xoxocotla",
            "Yanga",
            "Yecuatla",
            "Zacualpan",
            "Zaragoza",
            "Zentla",
            "Zongolica",
            "Zontecomatlán de López y Fuentes",
            "Zozocolco de Hidalgo"
        ]
    },
    {
        "state": "Yucatán",
        "country": "maxico",
        "cities": [
            "Abalá",
            "Acanceh",
            "Akil",
            "Baca",
            "Bokobá",
            "Buctzotz",
            "Cacalchén",
            "Calotmul",
            "Cansahcab",
            "Cantamayec",
            "Celestún",
            "Cenotillo",
            "Chacsinkin",
            "Chankom",
            "Chapab",
            "Chemax",
            "Chichimilá",
            "Chiculub Pueblo",
            "Chikindzonot",
            "Chocholá",
            "Chumayel",
            "Conkal",
            "Cuncunul",
            "Cuzamá",
            "Dzán",
            "Dzemul",
            "Dzidzantún",
            "Dzilam de Bravo",
            "Dzilam González",
            "Dzitás",
            "Dzoncauich",
            "Espita",
            "Halachó",
            "Hocabá",
            "Hoctún",
            "Homún",
            "Huhí",
            "Hunucmá",
            "Ixil",
            "Izamal",
            "Kanasín",
            "Kantunil",
            "Kaua",
            "Kinchil",
            "Kopomá",
            "Mama",
            "Maní",
            "Maxcanú",
            "Mayapán",
            "Mérida",
            "Mocochá",
            "Motul",
            "Muna",
            "Михирір",
            "Opichén",
            "Oxkutzcab",
            "Panabá",
            "Peto",
            "Progreso",
            "Quintana Roo",
            "Río Lagartos",
            "Sacalum",
            "Samahil",
            "San Felipe",
            "Sanahcat",
            "Santa Elena",
            "Seyé",
            "Sinanché",
            "Sotuta",
            "Sucilá",
            "Sudzal",
            "Suma",
            "Tahdziú",
            "Tahmek",
            "Teabo",
            "Tecoh",
            "Tekal de Venegas",
            "Tekantó",
            "Tekax",
            "Tekit",
            "Tekom",
            "Telchac Pueblo",
            "Telchac Puerto",
            "Temax",
            "Temozón",
            "Tepakán",
            "Tetiz",
            "Teya",
            "Ticul",
            "Timucuy",
            "Tinum",
            "Tixcacalcupul",
            "Tixkokob",
            "Tixmehuac",
            "Tixpéhual",
            "Tizimín",
            "Tunkás",
            "Tzucacab",
            "Tzucacab",
            "Ucú",
            "Umán",
            "Valladolid",
            "Xocchel",
            "Yaxcabá",
            "Yaxkukul",
            "Yobaín"
        ]
    },
    {
        "state": "Zacatecas",
        "country": "maxico",
        "cities": [
            "Apozol",
            "Apulco",
            "Atolinga",
            "Benito Juárez",
            "Calera",
            "Cañitas de Felipe Pescador",
            "Chalchihuites",
            "Concepción del Oro",
            "Cuauhtémoc",
            "El Plateado de Joaquín Amaro",
            "El Salvador",
            "Fresnillo",
            "Genaro Codina",
            "General Enrique Estrada",
            "General Francisco R. Murguía",
            "General Pánfilo Natera",
            "Guadalupe",
            "Huanusco",
            "Jalpa",
            "Jerez",
            "Jiménez del Teul",
            "Juan Aldama",
            "Juchipila",
            "Loreto",
            "Luis Moya",
            "Mazapil",
            "Melchor Ocampo",
            "Mezquital del Oro",
            "Miguel Auza",
            "Momax",
            "Monte Escobedo",
            "Morelos",
            "Moyahua de Estrada",
            "Nochistlán de Mejía",
            "Noria de Ángeles",
            "Ojocaliente",
            "Pánuco",
            "Pinos",
            "Río Grande",
            "Sain Alto",
            "Santa María de la Paz",
            "Sombrerete",
            "Susticacán",
            "Tabasco",
            "Tepechitlán",
            "Tepetongo",
            "Teúl de González Ortega",
            "Tlaltenango de Sánchez Román",
            "Trancoso",
            "Trinidad García de la Cadena",
            "Valparaíso",
            "Vetagrande",
            "Villa de Cos",
            "Villa García",
            "Villa González Ortega",
            "Villa Hidalgo",
            "Villanueva",
            "Zacatecas"
        ]
    }
  ];

  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Get unique countries
  const countries = Array.from(new Set(Locations.map(loc => loc.country)));
  // Filter states based on selected country
  const states = Locations.filter(loc => loc.country === selectedCountry);
  // Filter cities based on selected state
  const cities = states.find(loc => loc.state === selectedState)?.cities || [];

  useEffect(() => {
    setGuestUser(authUser.id == pet.owner.id ? true : false);
    setFounderId(authUser.id);
  }, [authUser.id, pet.owner.id]);

  useEffect(() => {
    const checkLostPetStatus = async () => {
      if ( authUser?.id === pet.owner.id ) {
        try {

          const response = await axios.post(
            `https://dev.virtual-assistant.xyz/api/pet/lost/status`, 
            { pet_id: pet.id }
          );
           
          if(response.status === 200) {

            if(response.data.pet === true) {
              setLostPetId(response.data.petlostId);
              setLostStatus(true);
            } else if(response.data.pet === false) {
              setLostPetButton(true);
            }

          }

          // console.log('Gate: ', response.data);
          // if (response.status === 200 ) {
          //   setLostPetId(response.data.pet.id);
          //   if(response.data.pet.status == 0){
          //     setLostStatus(true);
          //   }else if(response.data.pet.status == 1){
          //     setLostStatus(false);
          //   }
          //   // console.log('Res: ', response.data.pet);
          // } else { 
          //   setLostPetButton(true);
          // }

        } catch (error) {
          console.error('Error checking lost pet status:', error);
        }
      }
    };
    checkLostPetStatus();

    if( ! pet.rfid && guestUser) {
      setRFIDButton(true);
    }

    if( lostPetButton == false &&  lostStatus && guestUser) {
      setLostStatus(true);
    }

  }, [authUser, pet.id]);

  console.log(lostPetButton);

  const petLostActive = async () => {
    try {
      const response = await axios.post(
        `https://dev.virtual-assistant.xyz/api/pet/lost/active`, 
        {       
          pet_id: pet.id,
          lost_date: lostDate,
          lost_time: lostTime,
          user_id: authUser.id,
          lost_note: note,
        }
      );

      if (response.data.pet) {
        setLostPetButton(false);
        setModalVisible(false);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const addPetRFID = async () => {
    if (RFID.length === 15 && !isNaN(Number(RFID)) && RFID.startsWith('9')) {
      setRfidError(false);

      try {
        const response = await axios.post(
          `https://dev.virtual-assistant.xyz/api/pet/rfid`, 
          { 
            pet_id: pet.id, 
            rfid: RFID, 
          }
        );
          
        if (response.data) {
          setRFIDButton(false);
          setRFIDModalVisible(false);
        }

      } catch (error) {
        console.error('Pet RFID: ', error);
      }


    } else {
      setRfidError(true);
    }
  };

  const petFound = async () => {
    try {
        const response = await axios.post(
          `https://dev.virtual-assistant.xyz/api/pet/lost/found`, 
          { 
            pet_id: pet.id, 
            founderId: founderId,
            country: selectedCountry,
            state: selectedState,
            city: selectedCity,
            founderNote: founderNote,
          }
        );
          
        if (response.data.pet) {
          console.log('Response: ', response.data.pet);
          setSelectedCountry('');
          setSelectedState('');
          setSelectedCity('');
          setFounderNote('');
          setModalPetFoundVisible(false)
        }

      } catch (error) {
        console.error('Pet Found: ', error);
      }
  }

  const myPetFound = async () => {
    try {
        const response = await axios.post(
          `https://dev.virtual-assistant.xyz/api/pet/lost/status_change`, 
          { 
            lost_id: lostPetId, 
          }
        );
          
        if (response.status === 200) {
          if(response.data.pet.status == 1){
            setLostStatus(false);
            setLostPetButton(true);

          }
        }

      } catch (error) {
        console.error('Pet Found: ', error);
      }
  }

  const petTransfer = async () => {

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(newOwnerEmail);
  
    // Perform email validation
    if (isEmailValid) {
      setNewOwnerError(false);
      
      try {
        const response = await axios.post(
          `https://dev.virtual-assistant.xyz/api/pet/transfer/invite`, 
          { 
            pet_id: pet.id, 
            email: newOwnerEmail,
          }
        );
          
        if (response.data.invite) {
          // console.log('Response: ', response.data.invite);
          setNewOwnerEmail('');
          setModalPetTransferVisible(false)
        }

      } catch (error) {
        console.error('Pet RFID: ', error);
      }

    } else {
      // Set error if validation fails
      setNewOwnerError(true);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/woofio-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView}> 
      <View style={styles.container}> 
        <Image 
          source={{ uri: petProfile }} 
          style={styles.profile}
          resizeMode="cover"
        />
        <Text style={styles.titleHeading}>PET DETAILS</Text>

        <View style={styles.row}>
          <Text style={styles.rowHeading}>Name</Text>
          <Text style={styles.rowValue}>{pet.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowHeading}>Gender</Text>
          <Text style={styles.rowValue}>{pet.gender}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowHeading}>Breed</Text>
          <Text style={styles.rowValue}>{pet.breed}</Text>
        </View>

        {pet.age && (
          <View style={styles.row}>
            <Text style={styles.rowHeading}>Age</Text>
            <Text style={styles.rowValue}>{pet.age}</Text>
          </View>
        )}

        {pet.rfid && (
          <View style={styles.row}>
            <Text style={styles.rowHeading}>RFID</Text>
            <Text style={styles.rowValue}>{pet.rfid}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.rowHeading}>Note</Text>
          <Text style={styles.rowValue}>{pet.note}</Text>
        </View>

        <Text style={styles.titleHeading}>OWNER DETAILS</Text>

        <View style={styles.row}>
          <Text style={styles.rowHeading}>First Name</Text>
          <Text style={styles.rowValue}>{pet.owner.first_name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowHeading}>Last Name</Text>
          <Text style={styles.rowValue}>{pet.owner.last_name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowHeading}>Gender</Text>
          <Text style={styles.rowValue}>{pet.owner.gender}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowHeading}>Contact</Text>
          <Text style={styles.rowValue}>{pet.owner.mobile}</Text>
        </View>

        <View style={[styles.row, {marginBottom: 20}]}>
          <Text style={styles.rowHeading}>Address</Text>
          <Text style={styles.rowValue}>{pet.owner.address}</Text>
        </View>

        {lostPetButton && (
          <ButtonComponent
            icon='paw-off' 
            title='My Pet Lost' 
            onPress={() => setModalVisible(true)} 
            buttonColor={colors.red}
          />
        )}

        {RFIDButton && (
          <ButtonComponent
            icon='integrated-circuit-chip' 
            title='Add RFID' 
            onPress={() => setRFIDModalVisible(true)} 
            buttonColor={colors.black}
          />
        )}
        
        {guestUser && (
          <ButtonComponent
            icon='arrow-right-top' 
            title='Pet Transfer' 
            onPress={() => setModalPetTransferVisible(true)} 
            buttonColor={colors.primary}
          />
        )}

        {! guestUser && (
          <ButtonComponent
            icon='arrow-right-top' 
            title='Pet Found' 
            onPress={() => setModalPetFoundVisible(true)} 
            buttonColor={colors.green}
          />
        )}

        { lostStatus &&  (
          <ButtonComponent
            icon='paw' 
            title='My Pet Found' 
            onPress={() => myPetFound()} 
            buttonColor={colors.green}
          />
        )}

      {/* Modal for Adding a New Lost Info */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>

          <Text style={styles.modalTitle}>
            Pet Lost information
          </Text>

          <Button 
            style={styles.datePicker}
            mode='contained' 
            textColor={colors.black}
            contentStyle={{ justifyContent: 'flex-start' }} 
            onPress={() => setOpenDatePicker(true)} >
              {lostDate ? lostDate.toDateString() : 'Select Lost Date'}
          </Button>

          <DatePicker
            modal
            open={openDatePicker}
            date={lostDate}
            mode='date'
            onConfirm={(date) => {
              setOpenDatePicker(false);
              setLostDate(date);
            }}
            onCancel={() => {
              setOpenDatePicker(false);
            }}
          /> 
          <Button 
            style={styles.datePicker}
            mode='contained' 
            textColor={colors.black}
            contentStyle={{ justifyContent: 'flex-start' }} 
            onPress={() => setOpenTimePicker(true)} >
            {lostTime ? 
              lostTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 
              'Select Lost Time'}
          </Button>

          <DatePicker
            modal
            open={openTimePicker}
            date={lostDate}
            mode='time'
            onConfirm={(date) => {
              setOpenTimePicker(false);
              setLostTime(date);
            }}
            onCancel={() => {
              setOpenTimePicker(false);
            }}
          />
          <TextInput
            style={styles.input}
            mode='outlined'
            outlineColor={colors.textSecondary} 
            activeOutlineColor={colors.black}
            label='Pet Lost Note' 
            placeholder="Enter lost pet note"
            value={note} 
            onChangeText={setNote}
          />
          <ButtonComponent
            title='Submit' 
            onPress={() => petLostActive()} 
          />
          <ButtonComponent
            title='Close' 
            onPress={() => setModalVisible(false)}
            buttonColor={colors.blue_light}
            textColor={colors.primary}
          />

        </View>
      </Modal>

      {/* Modal for Adding a New RFID */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalRFIDVisible}
        onRequestClose={() => setRFIDModalVisible(false)}>
        <View style={styles.modalView}>

          <Text style={styles.modalTitle}>Pet RFID information</Text>
          <Text style={styles.modalSubTitle}>Note: 15 digits and starts with 9</Text>
          
          <TextInput
            style={styles.inputRFID}
            mode='outlined'
            outlineColor={colors.textSecondary} 
            activeOutlineColor={colors.black}
            label='PET RFID number' 
            placeholder="Enter RFID 15 digit"
            value={RFID} 
            onChangeText={setRFID}
          />
          <HelperText style={{marginBottom: 20,}} type="error" visible={rfidError}>
            Invalid format, must be exactly 15 digits!
          </HelperText>

          <ButtonComponent
            title='Submit' 
            onPress={() => addPetRFID()} 
          />
          <ButtonComponent
            title='Close' 
            onPress={() => setRFIDModalVisible(false)}
            buttonColor={colors.blue_light}
            textColor={colors.primary}
          />

        </View>
      </Modal>

      {/* Modal for Pet Trasfer */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPetTransferVisible}
        onRequestClose={() => setModalPetTransferVisible(false)}>
        <View style={styles.modalView}>

          <Text style={styles.modalTitle}>Pet Transfer</Text>
          <Text style={styles.modalSubTitle}>Email of new owner of this pet</Text>
          
          <TextInput
            style={styles.inputRFID}
            mode='outlined'
            outlineColor={colors.textSecondary} 
            activeOutlineColor={colors.black}
            label='Enter Email' 
            placeholder="Enter Email here"
            value={newOwnerEmail} 
            onChangeText={setNewOwnerEmail}
          />
          <HelperText style={{marginBottom: 20,}} type="error" visible={newOwnerError}>
            Required and valid farmat of Email
          </HelperText>

          <ButtonComponent
            title='Submit' 
            onPress={() => petTransfer()} 
          />
          <ButtonComponent
            title='Close' 
            onPress={() => setModalPetTransferVisible(false)}
            buttonColor={colors.blue_light}
            textColor={colors.primary}
          />

        </View>
      </Modal>

      {/* Modal for Pet Found Guest */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPetFoundVisible}
        onRequestClose={() => setModalPetFoundVisible(false)}>
        <View style={styles.modalView}>

          <Text style={styles.modalTitle}>Founder Information</Text>
          
          <TextInput
            style={styles.inputNote}
            mode='outlined'
            outlineColor={colors.textSecondary} 
            activeOutlineColor={colors.black}
            label='Enter note for Owner' 
            placeholder="Enter note for Owner"
            value={founderNote} 
            onChangeText={setFounderNote}
          />

          <View style={styles.selectContainer}>
            <Picker
              style={styles.selectBox}
              selectedValue={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value);
                setSelectedState(''); 
                setSelectedCity('');
              }}
            >
              <Picker.Item label="Select Country" value="" />
              {countries.map((country, index) => (
                <Picker.Item key={index} label={country.toUpperCase()} value={country} />
              ))}
            </Picker>
          </View>

          {/* State Select */}
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={selectedState}
              onValueChange={(value) => {
                setSelectedState(value);
                setSelectedCity(''); // Reset city when state changes
              }}
              enabled={states.length > 0} // Disable if no country selected
            >
            <Picker.Item label="Select State" value="" />
              {states.map((loc, index) => (
                <Picker.Item key={index} label={loc.state} value={loc.state} />
              ))}
            </Picker>
          </View>

          {/* City Select */}
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={selectedCity}
              onValueChange={(value) => setSelectedCity(value)}
              enabled={cities.length > 0} // Disable if no state selected
            >
            <Picker.Item label="Select City" value="" />
              {cities.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
            </Picker>
          </View>

          <ButtonComponent
            title='Submit' 
            onPress={() => petFound()} 
          />
          <ButtonComponent
            title='Close' 
            onPress={() => setModalPetFoundVisible(false)}
            buttonColor={colors.blue_light}
            textColor={colors.primary}
          />

        </View>
      </Modal>

      </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  rowHeading: {
    flex: 1,
    backgroundColor: colors.black,
    fontFamily: 'Freude', 
    color: colors.white,
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
    margin: 2,
  },
  rowValue: {
    flex: 1,
    backgroundColor: colors.primary,
    fontFamily: 'Freude', 
    color: colors.white,
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
    margin: 2,
  },
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  scrollView: {
    marginHorizontal: 20,
  },
  profile: {
    width: 120, 
    height: 120,
    marginBottom: 10,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: colors.primary,
  },
  titleHeading: {
    fontSize: 25,
    color: colors.black,
    fontFamily: 'Freude', 
    marginBottom: 10,
    marginTop: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  modalTitle: {
    fontSize: 25,
    marginBottom: 30,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalSubTitle: {
    marginBottom: 10,
    color: colors.black,
  },
  modelButton: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 5,
    marginBottom: 10,
  },
  modelButtonClose: {
    width: '100%',
    backgroundColor: colors.blue_light,
    padding: 5,
  },
  input: {
    height: 80,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  inputRFID: {
    height: 50,
    paddingHorizontal: 10,
  },
  datePicker: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 5,
    padding: 5,
    backgroundColor: colors.white,
    borderColor: colors.textSecondary,
    borderWidth: 1,
  },
  inputNote: {
    height: 80,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderColor: colors.textSecondary
  },
  selectContainer: {
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    borderRadius: 5,
  },
  selectBox: {
    borderColor: colors.primary,
  },
});

export default PetDetail;
