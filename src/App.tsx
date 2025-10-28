// src/App.tsx

import Login from "./pages/Login";
import React, { useEffect, useState, Suspense } from "react";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import NationalHQPage from "./pages/NationalHQPage";
import Header from "./components/Header"; // ✅ adjust if needed
import UsersPage from "./pages/Admin/UsersPage";
import Presidents from "./pages/Presidents";
import Footer from "./components/Footer";
import NationalExecutives from "./pages/National/NationalExecutives";
import AuthorProfile from "./pages/National/AuthorProfile";
import CouncilOfElders from "./pages/National/NationalCouncilOfElders";
import ProtectedRoute from "./components/ProtectedRoute";
import Regions from "./pages/National/Regions";
import EasternRegion from "./pages/Regions/Eastern/EasternRegion";
import EasternConstituencies from "./pages/Regions/Eastern/Constituencies/EasternConstituencies";
import FoundingFathers from "./pages/National/FoundingFathers";
import GreaterAccraRegion from "./pages/Regions/GreaterAccra/GreaterAccraRegion";
import GreaterAccraConstituenciesList from "./pages/Regions/GreaterAccra/Constituencies/ConstituenciesList";
import DomeKwabenya from "./pages/Regions/GreaterAccra/Constituencies/Dome-Kwabenya/DomeKwabenya";
import PollingStationViewer from "./pages/PollingStationViewer";
import NationalProjects from "./pages/NationalProjects";
import UserSelfPlacement from "./pages/UserSelfPlacement";

// Ashanti Region Pages
import AshantiRegionHome from "@pages/Regions/Ashanti/AshantiRegionHome";
import CentralRegionHome from "@pages/Regions/Central/CentralRegionHome";
import AhafoRegionHome from "@pages/Regions/Ahafo/AhafoRegionHome";
import BonoRegionHome from "@pages/Regions/Bono/BonoRegionHome";
import BonoEastRegionHome from "@pages/Regions/BonoEast/BonoEastRegionHome";
import NorthernRegionHome from "./pages/Regions/Northern/NorthernRegionHome";
import NorthEastRegionHome from "./pages/Regions/NorthEast/NorthEastRegionHome";
import SavannahRegionHome from "./pages/Regions/Savannah/SavannahRegionHome";
import UpperEastRegionHome from "./pages/Regions/UpperEast/UpperEastRegionHome";
import UpperWestRegionHome from "./pages/Regions/UpperWest/UpperWestRegionHome";
import VoltaRegionHome from "./pages/Regions/Volta/VoltaRegionHome";
import WesternRegionHome from "./pages/Regions/Western/WesternRegionHome";
import WesternNorthRegionHome from "./pages/Regions/WesternNorth/WesternNorthRegionHome";
import ThankYou from "./pages/ThankYou";
import Executives2000_2004 from "./pages/National/Executives/N-Executives2000_2004";
import Executives2016_2020 from "./pages/National/Executives/N-Executives2016_2020";
import NExecutives2024_2028 from "../src/pages/National/Executives/N-Executives2024_2028";
import Executives2012_2016 from "./pages/National/Executives/N-Executives2012_2016";
import Executives2008_2012 from "./pages/National/Executives/N-Executives2008_2012";
import Executives1992_1996 from "./pages/National/Executives/N-Executives1992_1996";
import Executives1996_2000 from "./pages/National/Executives/N-Executives1996_2000";
import Executives2004_2008 from "./pages/National/Executives/N-Executives2004_2008";
import Executives2020_2024 from "./pages/National/Executives/N-Executives2020_2024";
import NCouncil1992_1996 from "./pages/National/Council/N-Council1992_1996";
import NCouncil1996_2000 from "./pages/National/Council/N-Council1996_2000";
import NCouncil2000_2004 from "./pages/National/Council/N-Council2000_2004";
import NCouncil2004_2008 from "./pages/National/Council/N-Council2004_2008";
import NCouncil2008_2012 from "./pages/National/Council/N-Council2008_2012";
import NCouncil2012_2016 from "./pages/National/Council/N-Council2012_2016";
import NCouncil2016_2020 from "./pages/National/Council/N-Council2016_2020";
import NCouncil2020_2024 from "./pages/National/Council/N-Council2020_2024";
import NCouncil2024_2028 from "./pages/National/Council/N-Council2024_2028";
import PollingStationFormatter from "./tools/PollingStationFormatter";
import PollingStationsPage from "./pages/Generic/PollingStationsPage";
import CoordinatorsPage from "./pages/Generic/CoordinatorsPage";
import RegionalEldersPage from "./pages/Generic/RegionalEldersPage";
import ConstituencyExecutivesPage from "./pages/Generic/ConstituencyExecutivesPage";
import ConstituencyEldersPage from "./pages/Generic/ConstituencyEldersPage";
import MadinaConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Madina/MadinaConstituencyHome";
import AdentaConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Adenta/AdentaConstituencyHome";
import TrobuConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Trobu/TrobuConstituencyHome";
import AnyaaSowutuomConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Anyaa-Sowutuom/AnyaaSowutuomConstituencyHome";
import BortianorNgleshieAmanfroConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Bortianor-Ngleshie-Amanfro/BortianorNgleshieAmanfroConstituencyHome";
import AdaConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ada/AdaConstituencyHome";
import SegeConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Sege/SegeConstituencyHome";
import ShaiOsudokuConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Shai-Osudoku/ShaiOsudokuConstituencyHome";
import AblekumaNorthConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/AblekumaNorth/AblekumaNorthConstituencyHome";
import AblekumaCentralConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ablekuma-Central/AblekumaCentralConstituencyHome";
import AblekumaWestConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ablekuma-West/AblekumaWestConstituencyHome";
import WeijaGbaweConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Weija-Gbawe/WeijaGbaweConstituencyHome";
import AblekumaSouthConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ablekuma-South/AblekumaSouthConstituencyHome";
import AshaimanConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ashaiman/AshaimanConstituencyHome";
import AyawasoCentralConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ayawaso-Central/AyawasoCentralConstituencyHome";
import AyawasoEastConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ayawaso-East/AyawasoEastConstituencyHome";
import AyawasoNorthConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ayawaso-North/AyawasoNorthConstituencyHome";
import AyawasoWestWuogonConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ayawaso-West-Wuogon/AyawasoWestWuogonConstituencyHome";
import DadekotoponConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Dadekotopon/DadekotoponConstituencyHome";
import KorleKlotteyConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Korle-Klottey/KorleKlotteyConstituencyHome";
import KroworConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Krowor/KroworConstituencyHome";
import LedzokukuConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ledzokuku/LedzokukuConstituencyHome";
import NingoPrampramConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Ningo-Prampram/NingoPrampramConstituencyHome";
import OdododiodiooConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Odododiodioo/OdododiodiooConstituencyHome";
import OkaikweiNorthConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Okaikwei-North/OkaikweiNorthConstituencyHome";
import OkaikweiSouthConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Okaikwei-South/OkaikweiSouthConstituencyHome";
import TemaCentralConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Tema-Central/TemaCentralConstituencyHome";
import TemaEastConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Tema-East/TemaEastConstituencyHome";
import TemaWestConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Tema-West/TemaWestConstituencyHome";
import AmasamanConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Amasaman/AmasamanConstituencyHome";
import KponeKatamansoConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Kpone-Katamanso/KponeKatamansoConstituencyHome";
import OkaikweiCentralConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Okaikwei-Central/OkaikweiCentralConstituencyHome";
import DomeabraObomConstituencyHome from "./pages/Regions/GreaterAccra/Constituencies/Domeabra-Obom/DomeabraObomConstituencyHome";
import ConstituencyMMDCEPage from "./pages/Generic/ConstituencyMMDCEOffice";
import ConstituencyMPPage from "./pages/Generic/ConstituencyMPPage";
import RegionalExecutivesPage from "@pages/Generic/RegionalExecutivesPage";
import DonatePage from "./pages/Generic/DonatePage";
import ProjectsPage from "./pages/Generic/ProjectsPage";
import ProjectsAdmin from "./pages/Generic/ProjectsAdmin";
import BlogAdminDashboard from "./pages/Generic/BlogAdminDashboard";
import BlogForm from "./pages/Generic/BlogForm";
import GenericLogin from "./pages/Generic/Login";
import BlogPage from "./pages/Generic/BlogPage";


import AsunafoNorthConstituencyHome from "./pages/Regions/Ahafo/Constituencies/Asunafo-North/AsunafoNorthConstituencyHome";
import ConstituenciesList from "./pages/Regions/Ahafo/Constituencies/AhafoConstituenciesList";
import AsunafoSouthConstituencyHome from "./pages/Regions/Ahafo/Constituencies/Asunafo-South/AsunafoSouthConstituencyHome";
import AsutifiNorthConstituencyHome from "./pages/Regions/Ahafo/Constituencies/Asutifi-North/AsutifiNorthConstituencyHome";
import AsutifiSouthConstituencyHome from "./pages/Regions/Ahafo/Constituencies/Asutifi-South/AsutifiSouthConstituencyHome";
import TanoNorthConstituencyHome from "./pages/Regions/Ahafo/Constituencies/Tano-North/TanoNorthConstituencyHome";
import TanoSouthConstituencyHome from "./pages/Regions/Ahafo/Constituencies/Tano-South/TanoSouthConstituencyHome";
import AshantiConstituenciesList from "./pages/Regions/Ashanti/Constituencies/AshantiConstituenciesList";
import AdansiAsokwaConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Adansi-Asokwa/AdansiAsokwaConstituencyHome";
import AfigyaKwabreNorthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Afigya-Kwabre-North/AfigyaKwabreNorthConstituencyHome";
import AfigyaKwabreSouthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Afigya-Kwabre-South/AfigyaKwabreSouthConstituencyHome";
import AhafoAnoNorthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Ahafo-Ano-North/AhafoAnoNorthConstituencyHome";
import AhafoAnoSouthEastConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Ahafo-Ano-South-East/AhafoAnoSouthEastConstituencyHome";
import AhafoAnoSouthWestConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Ahafo-Ano-South-West/AhafoAnoSouthWestConstituencyHome";
import AsanteAkimCentralConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Asante-Akim-Central/AsanteAkimCentralConstituencyHome";
import AsanteAkimNorthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Asante-Akim-North/AsanteAkimNorthConstituencyHome";

import AsanteAkimSouthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Asante-Akim-South/AsanteAkimSouthConstituencyHome";
import AsokwaConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Asokwa/AsokwaConstituencyHome";
import AtwimaKwanwomaConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Atwima-Kwanwoma/AtwimaKwanwomaConstituencyHome";
import AtwimaMponuaConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Atwima-Mponua/AtwimaMponuaConstituencyHome";
import AtwimaNwabiagyaNorthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Atwima-Nwabiagya-North/AtwimaNwabiagyaNorthConstituencyHome";
import AtwimaNwabiagyaSouthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Atwima-Nwabiagya-South/AtwimaNwabiagyaSouthConstituencyHome";
import BekwaiConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Bekwai/BekwaiConstituencyHome";
import BosomeFrehoConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Bosome-Freho/BosomeFrehoConstituencyHome";
import BosomtweConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Bosomtwe/BosomtweConstituencyHome";
import EjisuConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Ejisu/EjisuConstituencyHome";
import EjuraSekyedumaseConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Ejura-Sekyedumase/EjuraSekyedumaseConstituencyHome";
import FomenaConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Fomena/FomenaConstituencyHome";
import KwabreEastConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Kwabre-East/KwabreEastConstituencyHome";
import MampongConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Mampong/MampongConstituencyHome";
import ManhyiaNorthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Manhyia-North/ManhyiaNorthConstituencyHome";
import ManhyiaSouthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Manhyia-South/ManhyiaSouthConstituencyHome";
import NewEdubiaseConstituencyHome from "./pages/Regions/Ashanti/Constituencies/New-Edubiase/NewEdubiaseConstituencyHome";
import NhyiaesoConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Nhyiaeso/NhyiaesoConstituencyHome";
import NsutaKwamangBeposoConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Nsuta-Kwamang-Beposo/NsutaKwamangBeposoConstituencyHome";
import ObuasiEastConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Obuasi-East/ObuasiEastConstituencyHome";
import ObuasiWestConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Obuasi-West/ObuasiWestConstituencyHome";
import OffinsoNorthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Offinso-North/OffinsoNorthConstituencyHome";
import OffinsoSouthConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Offinso-South/OffinsoSouthConstituencyHome";
import OforikromConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Oforikrom/OforikromConstituencyHome";
import OldTafoConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Old-Tafo/OldTafoConstituencyHome";
import OdotobriConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Odotobri/OdotobriConstituencyHome";
import BantamaConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Bantama/BantamaConstituencyHome";
import JuabenConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Juaben/JuabenConstituencyHome";
import KwadasoConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Kwadaso/KwadasoConstituencyHome";
import SuameConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Suame/SuameConstituencyHome";
import SubinConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Subin/SubinConstituencyHome";
import SekyereAframPlainsConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Sekyere-Afram-Plains/SekyereAframPlainsConstituencyHome";
import EffiduaseAsokoreConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Effiduase Asokore/Effiduase AsokoreConstituencyHome";
import AkrofuomConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Akrofuom/AkrofuomConstituencyHome";
import KumawuConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Kumawu/KumawuConstituencyHome";
import MansoNkwantaConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Manso-Nkwanta/Manso-NkwantaConstituencyHome";
import MansoAdubiaConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Manso Adubia/Manso-AdubiaConstituencyHome";
import AsawaseConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Asawase/AsawaseConstituencyHome";
import AfigyaSekyereEastConstituencyHome from "./pages/Regions/Ashanti/Constituencies/Afigya-Sekyere-East/AfigyaSekyereEastConstituencyHome";

import BonoConstituencies from "./pages/Regions/Bono/Constituencies/BonoConstituencies";
import SunyaniEastConstituencyHome from "./pages/Regions/Bono/Constituencies/Sunyani-East/SunyaniEastConstituencyHome";
import SunyaniWestConstituencyHome from "./pages/Regions/Bono/Constituencies/Sunyani-West/SunyaniWestConstituencyHome";
import DormaaCentralConstituencyHome from "./pages/Regions/Bono/Constituencies/Dormaa-Central/DormaaCentralConstituencyHome";
import DormaaEastConstituencyHome from "./pages/Regions/Bono/Constituencies/Dormaa-East/DormaaEastConstituencyHome";
import DormaaWestConstituencyHome from "./pages/Regions/Bono/Constituencies/Dormaa-West/DormaaWestConstituencyHome";
import BerekumEastConstituencyHome from "./pages/Regions/Bono/Constituencies/Berekum-East/BerekumEastConstituencyHome";
import BerekumWestConstituencyHome from "./pages/Regions/Bono/Constituencies/Berekum-West/BerekumWestConstituencyHome";
import JamanSouthConstituencyHome from "./pages/Regions/Bono/Constituencies/Jaman-South/JamanSouthConstituencyHome";
import JamanNorthConstituencyHome from "./pages/Regions/Bono/Constituencies/Jaman-North/JamanNorthConstituencyHome";
import TainConstituencyHome from "./pages/Regions/Bono/Constituencies/Tain/TainConstituencyHome";
import WenchiConstituencyHome from "./pages/Regions/Bono/Constituencies/Wenchi/WenchiConstituencyHome";
import BandaConstituencyHome from "./pages/Regions/Bono/Constituencies/Banda/BandaConstituencyHome";

import BonoEastConstituenciesList from "./pages/Regions/BonoEast/Constituencies/BonoEastConstituenciesList";
import KintampoNorthConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Kintampo-North/KintampoNorthConstituencyHome";
import KintampoSouthConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Kintampo-South/KintampoSouthConstituencyHome";
import NkoranzaNorthConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Nkoranza-North/NkoranzaNorthConstituencyHome";
import PruEastConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Pru-East/PruEastConstituencyHome";
import NkoranzaSouthConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Nkoranza-South/NkoranzaSouthConstituencyHome";
import PruWestConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Pru-West/PruWestConstituencyHome";
import SeneEastConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Sene-East/SeneEastConstituencyHome";
import SeneWestConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Sene-West/SeneWestConstituencyHome";
import TechimanNorthConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Techiman-North/TechimanNorthConstituencyHome";
import TechimanSouthConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Techiman-South/TechimanSouthConstituencyHome";
import AtebubuAmantinConstituencyHome from "./pages/Regions/BonoEast/Constituencies/Atebubu-Amantin/AtebubuAmantinConstituencyHome";

import CentralConstituenciesList from "./pages/Regions/Central/Constituencies/CentralConstituenciesList";
import KomendaEdinaEguafoAbremConstituencyHome from "./pages/Regions/Central/Constituencies/Komenda-Edina-Eguafo-Abrem/KomendaEdinaEguafoAbremConstituencyHome";
import CapeCoastSouthConstituencyHome from "./pages/Regions/Central/Constituencies/Cape-Coast-South/CapeCoastSouthConstituencyHome";
import CapeCoastNorthConstituencyHome from "./pages/Regions/Central/Constituencies/Cape-Coast-North/CapeCoastNorthConstituencyHome";
import AburaAsebuKwamankeseConstituencyHome from "./pages/Regions/Central/Constituencies/Abura-Asebu-Kwamankese/AburaAsebuKwamankeseConstituencyHome";
import MfantsemanConstituencyHome from "./pages/Regions/Central/Constituencies/Mfantseman/MfantsemanConstituencyHome";
import EkumfiConstituencyHome from "./pages/Regions/Central/Constituencies/Ekumfi/EkumfiConstituencyHome";
import AjumakoEnyanEssiamConstituencyHome from "./pages/Regions/Central/Constituencies/Ajumako-Enyan-Essiam/AjumakoEnyanEssiamConstituencyHome";
import GomoaCentralConstituencyHome from "./pages/Regions/Central/Constituencies/Gomoa-Central/GomoaCentralConstituencyHome";
import GomoaWestConstituencyHome from "./pages/Regions/Central/Constituencies/Gomoa-West/GomoaWestConstituencyHome";
import GomoaEastConstituencyHome from "./pages/Regions/Central/Constituencies/Gomoa-East/GomoaEastConstituencyHome";
import EffutuConstituencyHome from "./pages/Regions/Central/Constituencies/Effutu/EffutuConstituencyHome";
import AwutuSenyaWestConstituencyHome from "./pages/Regions/Central/Constituencies/Awutu-Senya-West/AwutuSenyaWestConstituencyHome";
import AwutuSenyaEastConstituencyHome from "./pages/Regions/Central/Constituencies/Awutu-Senya-East/AwutuSenyaEastConstituencyHome";
import AgonaEastConstituencyHome from "./pages/Regions/Central/Constituencies/Agona-East/AgonaEastConstituencyHome";
import AgonaWestConstituencyHome from "./pages/Regions/Central/Constituencies/Agona-West/AgonaWestConstituencyHome";
import AsikumaOdobenBrakwaConstituencyHome from "./pages/Regions/Central/Constituencies/Asikuma-Odoben-Brakwa/AsikumaOdobenBrakwaConstituencyHome";
import AssinCentralConstituencyHome from "./pages/Regions/Central/Constituencies/Assin-Central/AssinCentralConstituencyHome";
import AssinNorthConstituencyHome from "./pages/Regions/Central/Constituencies/Assin-North/AssinNorthConstituencyHome";
import AssinSouthConstituencyHome from "./pages/Regions/Central/Constituencies/Assin-South/AssinSouthConstituencyHome";
import TwifoAttiMorkwaConstituencyHome from "./pages/Regions/Central/Constituencies/Twifo-Atti-Morkwa/TwifoAttiMorkwaConstituencyHome";
import HemangLowerDenkyiraConstituencyHome from "./pages/Regions/Central/Constituencies/Hemang-Lower-Denkyira/HemangLowerDenkyiraConstituencyHome";
import UpperDenkyiraWestConstituencyHome from "./pages/Regions/Central/Constituencies/Upper-Denkyira-West/UpperDenkyiraWestConstituencyHome";
import UpperDenkyiraEastConstituencyHome from "./pages/Regions/Central/Constituencies/Upper-Denkyira-East/UpperDenkyiraEastConstituencyHome";

import EasternConstituenciesList from "./pages/Regions/Eastern/Constituencies/EasternConstituenciesList";
import AsuogyamanConstituencyHome from "./pages/Regions/Eastern/Constituencies/Asuogyaman/AsuogyamanConstituencyHome";
import LowerManyaKroboConstituencyHome from "./pages/Regions/Eastern/Constituencies/Lower-Manya-Krobo/LowerManyaKroboConstituencyHome";
import UpperManyaKroboConstituencyHome from "./pages/Regions/Eastern/Constituencies/Upper-Manya-Krobo/UpperManyaKroboConstituencyHome";
import YiloKroboConstituencyHome from "./pages/Regions/Eastern/Constituencies/Yilo-Krobo/YiloKroboConstituencyHome";
import NewJuabenSouthConstituencyHome from "./pages/Regions/Eastern/Constituencies/New-Juaben-South/NewJuabenSouthConstituencyHome";
import NewJuabenNorthConstituencyHome from "./pages/Regions/Eastern/Constituencies/New-Juaben-North/NewJuabenNorthConstituencyHome";
import AkropongConstituencyHome from "./pages/Regions/Eastern/Constituencies/Akropong/AkropongConstituencyHome";
import OkereConstituencyHome from "./pages/Regions/Eastern/Constituencies/Okere/OkereConstituencyHome";
import AkuapemSouthConstituencyHome from "./pages/Regions/Eastern/Constituencies/Akuapem-South/AkuapemSouthConstituencyHome";
import NsawamAdoagyiriConstituencyHome from "./pages/Regions/Eastern/Constituencies/Nsawam-Adoagyiri/NsawamAdoagyiriConstituencyHome";
import SuhumConstituencyHome from "./pages/Regions/Eastern/Constituencies/Suhum/SuhumConstituencyHome";
import AyensuanoConstituencyHome from "./pages/Regions/Eastern/Constituencies/Ayensuano/AyensuanoConstituencyHome";
import LowerWestAkimConstituencyHome from "./pages/Regions/Eastern/Constituencies/Lower-West-Akim/LowerWestAkimConstituencyHome";
import UpperWestAkimConstituencyHome from "./pages/Regions/Eastern/Constituencies/Upper-West-Akim/UpperWestAkimConstituencyHome";
import AkimOdaConstituencyHome from "./pages/Regions/Eastern/Constituencies/Akim-Oda/AkimOdaConstituencyHome";
import AseneAkrosoMansoConstituencyHome from "./pages/Regions/Eastern/Constituencies/Asene-Akroso-Manso/AseneAkrosoMansoConstituencyHome";
import AkimSwedruConstituencyHome from "./pages/Regions/Eastern/Constituencies/Akim-Swedru/AkimSwedruConstituencyHome";
import AkyeaseConstituencyHome from "./pages/Regions/Eastern/Constituencies/Achiase/AchiaaseConstituencyHome";
import OfoaseAyirebiConstituencyHome from "./pages/Regions/Eastern/Constituencies/Ofoase-Ayirebi/OfoaseAyirebiConstituencyHome";
import KadeConstituencyHome from "./pages/Regions/Eastern/Constituencies/Kade/KadeConstituencyHome";
import AkwatiaConstituencyHome from "./pages/Regions/Eastern/Constituencies/Akwatia/AkwatiaConstituencyHome";
import AbiremConstituencyHome from "./pages/Regions/Eastern/Constituencies/Abirem/AbiremConstituencyHome";
import AbuakwaSouthConstituencyHome from "./pages/Regions/Eastern/Constituencies/Abuakwa-South/AbuakwaSouthConstituencyHome";
import AbuakwaNorthConstituencyHome from "./pages/Regions/Eastern/Constituencies/Abuakwa-North/AbuakwaNorthConstituencyHome";
import AtiwaWestConstituencyHome from "./pages/Regions/Eastern/Constituencies/Atiwa-West/AtiwaWestConstituencyHome";
import AtiwaEastConstituencyHome from "./pages/Regions/Eastern/Constituencies/Atiwa-East/AtiwaEastConstituencyHome";
import FanteakwaNorthConstituencyHome from "./pages/Regions/Eastern/Constituencies/Fanteakwa-North/FanteakwaNorthConstituencyHome";
import FanteakwaSouthConstituencyHome from "./pages/Regions/Eastern/Constituencies/Fanteakwa-South/FanteakwaSouthConstituencyHome";
import NkawkawConstituencyHome from "./pages/Regions/Eastern/Constituencies/Nkawkaw/NkawkawConstituencyHome";
import MpraesoConstituencyHome from "./pages/Regions/Eastern/Constituencies/Mpraeso/MpraesoConstituencyHome";
import KwahuAframPlainsNorthConstituencyHome from "./pages/Regions/Eastern/Constituencies/Kwahu-Afram-Plains-North/KwahuAframPlainsNorthConstituencyHome";
import AframPlainsSouthConstituencyHome from "./pages/Regions/Eastern/Constituencies/Afram-Plains-South/AframPlainsSouthConstituencyHome";
import KwahuEastConstituencyHome from "./pages/Regions/Eastern/Constituencies/Kwahu-East/KwahuEastConstituencyHome";

import NorthernConstituenciesList from "./pages/Regions/Northern/Constituencies/NorthernConstituenciesList";
import KpandaiConstituencyHome from "./pages/Regions/Northern/Constituencies/Kpandai/KpandaiConstituencyHome";
import WulensiConstituencyHome from "./pages/Regions/Northern/Constituencies/Wulensi/WulensiConstituencyHome";
import ZabzuguConstituencyHome from "./pages/Regions/Northern/Constituencies/Zabzugu/ZabzuguConstituencyHome";
import TataleSanguliConstituencyHome from "./pages/Regions/Northern/Constituencies/Tatale-Sanguli/TataleSanguliConstituencyHome";
import YendiConstituencyHome from "./pages/Regions/Northern/Constituencies/Yendi/YendiConstituencyHome";
import MionConstituencyHome from "./pages/Regions/Northern/Constituencies/Mion/MionConstituencyHome";
import SabobaConstituencyHome from "./pages/Regions/Northern/Constituencies/Saboba/SabobaConstituencyHome";
import KaragaConstituencyHome from "./pages/Regions/Northern/Constituencies/Karaga/KaragaConstituencyHome";
import SaveluguConstituencyHome from "./pages/Regions/Northern/Constituencies/Savelugu/SaveluguConstituencyHome";
import NantonConstituencyHome from "./pages/Regions/Northern/Constituencies/Nanton/NantonConstituencyHome";
import GusheguConstituencyHome from "./pages/Regions/Northern/Constituencies/Gushegu/GusheguConstituencyHome";
import TamaleSouthConstituencyHome from "./pages/Regions/Northern/Constituencies/Tamale-South/TamaleSouthConstituencyHome";
import TamaleCentralConstituencyHome from "./pages/Regions/Northern/Constituencies/Tamale-Central/TamaleCentralConstituencyHome";
import SagnariguConstituencyHome from "./pages/Regions/Northern/Constituencies/Sagnarigu/SagnariguConstituencyHome";
import TamaleNorthConstituencyHome from "./pages/Regions/Northern/Constituencies/Tamale-North/TamaleNorthConstituencyHome";
import TolonConstituencyHome from "./pages/Regions/Northern/Constituencies/Tolon/TolonConstituencyHome";
import KumbunguConstituencyHome from "./pages/Regions/Northern/Constituencies/Kumbungu/KumbunguConstituencyHome";

import NorthEastConstituenciesList from "./pages/Regions/NorthEast/Constituencies/NorthEastConstituenciesList";
import WalewaleConstituencyHome from "./pages/Regions/NorthEast/Constituencies/Walewale/WalewaleConstituencyHome";
import YagabaKuboriConstituencyHome from "./pages/Regions/NorthEast/Constituencies/Yagaba-Kubori/YagabaKuboriConstituencyHome";
import NaleriguGambagaConstituencyHome from "./pages/Regions/NorthEast/Constituencies/Nalerigu-Gambaga/NaleriguGambagaConstituencyHome";
import BunkpuruguConstituencyHome from "./pages/Regions/NorthEast/Constituencies/Bunkpurugu/BunkpuruguConstituencyHome";
import YunyooConstituencyHome from "./pages/Regions/NorthEast/Constituencies/Yunyoo/YunyooConstituencyHome";
import ChereponiConstituencyHome from "./pages/Regions/NorthEast/Constituencies/Chereponi/ChereponiConstituencyHome";
import OtiConstituenciesList from "./pages/Regions/Oti/Constituencies/OtiConstituenciesList";
import BuemConstituencyHome from "./pages/Regions/Oti/Constituencies/Buem/BuemConstituencyHome";
import BiakoyeConstituencyHome from "./pages/Regions/Oti/Constituencies/Biakoye/BiakoyeConstituencyHome";
import AkanConstituencyHome from "./pages/Regions/Oti/Constituencies/Akan/AkanConstituencyHome";
import KrachiEastConstituencyHome from "./pages/Regions/Oti/Constituencies/Krachi-East/KrachiEastConstituencyHome";
import KrachiWestConstituencyHome from "./pages/Regions/Oti/Constituencies/Krachi-West/KrachiWestConstituencyHome";
import KrachiNchumuruConstituencyHome from "./pages/Regions/Oti/Constituencies/Krachi-Nchumuru/KrachiNchumuruConstituencyHome";
import NkwantaSouthConstituencyHome from "./pages/Regions/Oti/Constituencies/Nkwanta-South/NkwantaSouthConstituencyHome";
import NkwantaNorthConstituencyHome from "./pages/Regions/Oti/Constituencies/Nkwanta-North/NkwantaNorthConstituencyHome";
import GuanConstituencyHome from "./pages/Regions/Oti/Constituencies/Guan/GuanConstituencyHome";

import OtiRegionHome from "./pages/Regions/Oti/OtiRegionHome";
import SavannahConstituenciesList from "./pages/Regions/Savannah/Constituencies/SavannahConstituenciesList";
import BoleBamboiConstituencyHome from "./pages/Regions/Savannah/Constituencies/Bole-Bamboi/BoleBamboiConstituencyHome";
import SawlaTunaKalbaConstituencyHome from "./pages/Regions/Savannah/Constituencies/Sawla-Tuna-Kalba/SawlaTunaKalbaConstituencyHome";
import DamongoConstituencyHome from "./pages/Regions/Savannah/Constituencies/Damongo/DamongoConstituencyHome";
import DaboyaMankariguConstituencyHome from "./pages/Regions/Savannah/Constituencies/Daboya-Mankarigu/DaboyaMankariguConstituencyHome";
import YapeiKusawguConstituencyHome from "./pages/Regions/Savannah/Constituencies/Yapei-Kusawgu/YapeiKusawguConstituencyHome";
import SalagaSouthConstituencyHome from "./pages/Regions/Savannah/Constituencies/Salaga-South/SalagaSouthConstituencyHome";
import SalagaNorthConstituencyHome from "./pages/Regions/Savannah/Constituencies/Salaga-North/SalagaNorthConstituencyHome";

import UpperEastConstituenciesList from "./pages/Regions/UpperEast/Constituencies/UpperEastConstituenciesList";
import BuilsaSouthConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Builsa-South/BuilsaSouthConstituencyHome";
import BuilsaNorthConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Builsa-North/BuilsaNorthConstituencyHome";
import NavrongoCentralConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Navrongo-Central/NavrongoCentralConstituencyHome";
import ChianaPagaConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Chiana-Paga/ChianaPagaConstituencyHome";
import BolgatangaCentralConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Bolgatanga-Centra/BolgatangaCentralConstituencyHome";
import BolgaEastConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Bolga-East/BolgaEastConstituencyHome";
import BongoConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Bongo/BongoConstituencyHome";
import NabdamConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Nabdam/NabdamConstituencyHome";
import ZebillaConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Zebilla/ZebillaConstituencyHome";
import BawkuCentralConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Bawku-Central/BawkuCentralConstituencyHome";
import GaruConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Garu/GaruConstituencyHome";
import TempaneConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Tempane/TempaneConstituencyHome";
import BinduriConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Binduri/BinduriConstituencyHome";
import PusigaConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Pusiga/PusigaConstituencyHome";
import TalensiConstituencyHome from "./pages/Regions/UpperEast/Constituencies/Talensi/TalensiConstituencyHome";

import UpperWestConstituenciesList from "./pages/Regions/UpperWest/Constituencies/UpperWestConstituenciesList";
import WaCentralConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Wa-Central/WaCentralConstituencyHome";
import WaWestConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Wa-West/WaWestConstituencyHome";
import WaEastConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Wa-East/WaEastConstituencyHome";
import NadowliKaleoConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Nadowli-Kaleo/NadowliKaleoConstituencyHome";
import DaffiamaBussieIssaConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Daffiama-Bussie-Issa/DaffiamaBussieIssaConstituencyHome";
import JirapaConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Jirapa/JirapaConstituencyHome";
import LambussieConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Lambussie/LambussieConstituencyHome";
import LawraConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Lawra/LawraConstituencyHome";
import NandomConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Nandom/NandomConstituencyHome";
import SissalaWestConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Sissala-West/SissalaWestConstituencyHome";
import SissalaEastConstituencyHome from "./pages/Regions/UpperWest/Constituencies/Sissala-East/SissalaEastConstituencyHome";

import VoltaConstituenciesList from "./pages/Regions/Volta/Constituencies/VoltaConstituenciesList";
import KetaConstituencyHome from "./pages/Regions/Volta/Constituencies/Keta/KetaConstituencyHome";
import AnloConstituencyHome from "./pages/Regions/Volta/Constituencies/Anlo/AnloConstituencyHome";
import KetuSouthConstituencyHome from "./pages/Regions/Volta/Constituencies/Ketu-South/KetuSouthConstituencyHome";
import KetuNorthConstituencyHome from "./pages/Regions/Volta/Constituencies/Ketu-North/KetuNorthConstituencyHome";
import AkatsiSouthConstituencyHome from "./pages/Regions/Volta/Constituencies/Akatsi-South/AkatsiSouthConstituencyHome";
import AkatsiNorthConstituencyHome from "./pages/Regions/Volta/Constituencies/Akatsi-North/AkatsiNorthConstituencyHome";
import SouthTonguConstituencyHome from "./pages/Regions/Volta/Constituencies/South-Tongu/SouthTonguConstituencyHome";
import CentralTonguConstituencyHome from "./pages/Regions/Volta/Constituencies/Central-Tongu/CentralTonguConstituencyHome";
import NorthTonguConstituencyHome from "./pages/Regions/Volta/Constituencies/North-Tongu/NorthTonguConstituencyHome";
import AdakluConstituencyHome from "./pages/Regions/Volta/Constituencies/Adaklu/AdakluConstituencyHome";
import AgotimeZiopeConstituencyHome from "./pages/Regions/Volta/Constituencies/Agotime-Ziope/AgotimeZiopeConstituencyHome";
import HoCentralConstituencyHome from "./pages/Regions/Volta/Constituencies/Ho-Central/HoCentralConstituencyHome";
import HoWestConstituencyHome from "./pages/Regions/Volta/Constituencies/Ho-West/HoWestConstituencyHome";
import SouthDayiConstituencyHome from "./pages/Regions/Volta/Constituencies/South-Dayi/SouthDayiConstituencyHome";
import KpandoConstituencyHome from "./pages/Regions/Volta/Constituencies/Kpando/KpandoConstituencyHome";
import NorthDayiConstituencyHome from "./pages/Regions/Volta/Constituencies/North-Dayi/NorthDayiConstituencyHome";
import HohoeConstituencyHome from "./pages/Regions/Volta/Constituencies/Hohoe/HohoeConstituencyHome";
import AfadjatoSouthConstituencyHome from "./pages/Regions/Volta/Constituencies/Afadjato-South/AfadjatoSouthConstituencyHome";

import WesternConstituenciesList from "./pages/Regions/Western/Constituencies/WesternConstituenciesList";
import EssikaduKetanConstituencyHome from "./pages/Regions/Western/Constituencies/Essikadu-Ketan/EssikaduKetanConstituencyHome";
import JomoroConstituencyHome from "./pages/Regions/Western/Constituencies/Jomoro/JomoroConstituencyHome";
import EllembeleConstituencyHome from "./pages/Regions/Western/Constituencies/Ellembele/EllembeleConstituencyHome";
import EvalueAjumoroGwiraConstituencyHome from "./pages/Regions/Western/Constituencies/Evalue-Ajumoro-Gwira/EvalueAjumoroGwiraConstituencyHome";
import AhantaWestConstituencyHome from "./pages/Regions/Western/Constituencies/Ahanta-West/AhantaWestConstituencyHome";
import TakoradiConstituencyHome from "./pages/Regions/Western/Constituencies/Takoradi/TakoradiConstituencyHome";
import SekondiConstituencyHome from "./pages/Regions/Western/Constituencies/Sekondi/SekondiConstituencyHome";
import EffiaConstituencyHome from "./pages/Regions/Western/Constituencies/Effia/EffiaConstituencyHome";
import KwesimintsimConstituencyHome from "./pages/Regions/Western/Constituencies/Kwesimintsim/KwesimintsimConstituencyHome";
import ShamaConstituencyHome from "./pages/Regions/Western/Constituencies/Shama/ShamaConstituencyHome";
import WassaEastConstituencyHome from "./pages/Regions/Western/Constituencies/Wassa-Eas/WassaEastConstituencyHome";
import MpohorConstituencyHome from "./pages/Regions/Western/Constituencies/Mpohor/MpohorConstituencyHome";
import TakwaNsuaemConstituencyHome from "./pages/Regions/Western/Constituencies/Takwa-Nsuaem/TakwaNsuaemConstituencyHome";
import AmanfiEastConstituencyHome from "./pages/Regions/Western/Constituencies/Amanfi-East/AmanfiEastConstituencyHome";
import PresteaHuniValleyConstituencyHome from "./pages/Regions/Western/Constituencies/Prestea-Huni-Valley/PresteaHuniValleyConstituencyHome";
import AmanfiCentralConstituencyHome from "./pages/Regions/Western/Constituencies/Amanfi-Central/AmanfiCentralConstituencyHome";
import AmanfiWestConstituencyHome from "./pages/Regions/Western/Constituencies/Amanfi-West/AmanfiWestConstituencyHome";

import WesternNorthConstituenciesList from "./pages/Regions/WesternNorth/Constituencies/WesternNorthConstituenciesList";
import AowinConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Aowin/AowinConstituencyHome";
import SuamanConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Suaman/SuamanConstituencyHome";
import BibianiAnhwiasoBekwaiConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Bibiani-Anhwiaso-Bekwai/BibianiAnhwiasoBekwaiConstituencyHome";
import SefwiWiawsoConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Sefwi-Wiawso/Sefwi-Wiawso/SefwiWiawsoConstituencyHome";
import SefwiAkontombraConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Sefwi-Akontombra/SefwiAkontombraConstituencyHome";
import JuabosoConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Juaboso/JuabosoConstituencyHome";
import BodiConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Bodi/BodiConstituencyHome";
import BiaWestConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Bia-West/BiaWestConstituencyHome";
import BiaEastConstituencyHome from "./pages/Regions/WesternNorth/Constituencies/Bia-East/BiaEastConstituencyHome";
import Dashboard from "./pages/Dashboard";
// Generic Pages
import BlogPostPage from "./pages/Generic/BlogPostPage";
import ConstituencyPage from "./pages/Generic/ConstituencyPage";

// Lazy-loaded pages
const LazyUserSelfPlacement = React.lazy(() => import("@pages/UserSelfPlacement"));
const LazyDashboardPage = React.lazy(() => import("@pages/Dashboard"));
const LazyNationalHeadquartersPage = React.lazy(() => import("@pages/NationalHQPage"));
const LazyConstituencyPage = React.lazy(() => import("@pages/Generic/ConstituencyPage"));

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Always log backend URL once on mount
  useEffect(() => {
    console.log("✅ Using API_BASE_URL:", import.meta.env.VITE_BACKEND_URL);
  }, []);

  // 🩵 Keep backend awake every 10 minutes
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_BACKEND_URL;
    if (!API_BASE) return;

    const ping = async () => {
      try {
        await fetch(`${API_BASE}/health`, { mode: "cors" });
        console.log("🌐 Backend ping successful");
      } catch (err) {
        console.warn("⚠️ Backend ping failed:", err);
      }
    };

    ping(); // immediate warm-up
    const interval = setInterval(ping, 600000); // every 10 minutes
    return () => clearInterval(interval);
  }, []);

  // 🚧 TEMPORARY BACKEND CONNECTION TEST (REMOVE AFTER VERIFICATION)
  const [backendStatus, setBackendStatus] = useState<string>("⏳ Checking backend connection...");

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) return;

    fetch(`${backendUrl}/health`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Backend not reachable");
        const data = await res.json();
        setBackendStatus(`✅ Connected to ${data.service} • Version: ${data.version}`);
      })
      .catch(() => {
        setBackendStatus("❌ Backend not reachable");
      });
  }, []);
  // 🚧 END OF TEMPORARY BACKEND CONNECTION TEST

  const hideUIOnPaths = ["/self-placement", "/national-executives"];
  const shouldHideHeader = hideUIOnPaths.includes(location.pathname);

  // ✅ Handle redirect logic
  useEffect(() => {
    try {
      const lastUserStr = localStorage.getItem("lastUser");
      const lastUser = lastUserStr ? JSON.parse(lastUserStr) : null;
      const savedRegion = localStorage.getItem("region");
      const savedConstituency = localStorage.getItem("constituency");

      if (!lastUser && location.pathname !== "/self-placement") {
        navigate("/self-placement", { replace: true });
        return;
      }

      if (lastUser && location.pathname === "/") {
        if (savedRegion && savedConstituency) {
          const regionSlug = savedRegion.toLowerCase().replace(/\s+/g, "-");
          const constituencySlug = savedConstituency.toLowerCase().replace(/\s+/g, "-");
          navigate(`/regions/${regionSlug}/constituencies/${constituencySlug}`, { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (err) {
      console.error("App redirect error:", err);
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {/* ✅ Header only when allowed */}
      {!shouldHideHeader && <Header />}

      {/* 🚧 TEMPORARY BACKEND CONNECTION STATUS DISPLAY */}
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          background: backendStatus.startsWith("✅") ? "#d1e7dd" : "#f8d7da",
          color: backendStatus.startsWith("✅") ? "#0f5132" : "#842029",
          fontWeight: "bold",
        }}
      >
        {backendStatus}
      </div>
      {/* 🚧 END OF TEMPORARY BACKEND CONNECTION STATUS DISPLAY */}

      {!shouldHideHeader && !location.pathname.startsWith("/national-executives") && (
        <div className="text-center py-2 bg-light border-bottom">
          <a
            href="/regions"
            className="btn btn-outline-primary fw-bold"
            style={{ fontSize: "1.1rem" }}
          >
            🌍 Explore Ghana's 16 Regions
          </a>
        </div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>


          <Route path="/self-placement" element={<LazyUserSelfPlacement />} />
          <Route path="/dashboard" element={<LazyDashboardPage />} />
          <Route path="/national-headquarters" element={<LazyNationalHeadquartersPage />} />
          <Route
            path="/regions/:region/constituencies/:constituency"
            element={<LazyConstituencyPage />}
          />       
        <Route
          path="/regions/:region/constituencies/:constituency"
          element={<ConstituencyPage />}
        />

        <Route
          path="/regions/western-north/constituencies/bia-east"
          element={<BiaEastConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies/bia-west"
          element={<BiaWestConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies/bodi"
          element={<BodiConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies/juaboso"
          element={<JuabosoConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies/sefwi-akontombra"
          element={<SefwiAkontombraConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies/sefwi-wiawso"
          element={<SefwiWiawsoConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies/bibiani-anhwiaso-bekwai"
          element={<BibianiAnhwiasoBekwaiConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies/suaman"
          element={<SuamanConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies/aowin"
          element={<AowinConstituencyHome />}
        />
        <Route
          path="/regions/western-north/constituencies"
          element={<WesternNorthConstituenciesList />}
        />


        <Route
          path="/regions/western/constituencies/amanfi-west"
          element={<AmanfiWestConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/amanfi-central"
          element={<AmanfiCentralConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/prestea-huni-valley"
          element={<PresteaHuniValleyConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/amanfi-east"
          element={<AmanfiEastConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/takwa-nsuaem"
          element={<TakwaNsuaemConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/mpohor"
          element={<MpohorConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/wassa-east"
          element={<WassaEastConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/shama"
          element={<ShamaConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/kwesimintsim"
          element={<KwesimintsimConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/effia"
          element={<EffiaConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/sekondi"
          element={<SekondiConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/takoradi"
          element={<TakoradiConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/ahanta-west"
          element={<AhantaWestConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/evalue-ajumoro-gwira"
          element={<EvalueAjumoroGwiraConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/ellembele"
          element={<EllembeleConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/jomoro"
          element={<JomoroConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies/essikadu-ketan"
          element={<EssikaduKetanConstituencyHome />}
        />
        <Route
          path="/regions/western/constituencies"
          element={<WesternConstituenciesList />}
        />


        <Route
          path="/regions/volta/constituencies/afadjato-south"
          element={<AfadjatoSouthConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/hohoe"
          element={<HohoeConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/north-dayi"
          element={<NorthDayiConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/kpando"
          element={<KpandoConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/south-dayi"
          element={<SouthDayiConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/ho-west"
          element={<HoWestConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/ho-central"
          element={<HoCentralConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/agotime-ziope"
          element={<AgotimeZiopeConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/adaklu"
          element={<AdakluConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/north-tongu"
          element={<NorthTonguConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/central-tongu"
          element={<CentralTonguConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/south-tongu"
          element={<SouthTonguConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/akatsi-north"
          element={<AkatsiNorthConstituencyHome />}
        /> 
        <Route
          path="/regions/volta/constituencies/akatsi-south"
          element={<AkatsiSouthConstituencyHome />}
        />    
        <Route
          path="/regions/volta/constituencies/ketu-north"
          element={<KetuNorthConstituencyHome />}
        />  
        <Route
           path="/regions/volta/constituencies/ketu-south"
           element={<KetuSouthConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/anlo"
          element={<AnloConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies/keta"
          element={<KetaConstituencyHome />}
        />
        <Route
          path="/regions/volta/constituencies"
          element={<VoltaConstituenciesList />}
        />


        <Route
          path="/regions/upper-west/constituencies/sissala-east"
          element={<SissalaEastConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/sissala-west"
          element={<SissalaWestConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/nandom"
          element={<NandomConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/lawra"
          element={<LawraConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/lambussie"
          element={<LambussieConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/jirapa"
          element={<JirapaConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/daffiama-bussie-issa"
          element={<DaffiamaBussieIssaConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/nadowli-kaleo"
          element={<NadowliKaleoConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/wa-east"
          element={<WaEastConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/wa-west"
          element={<WaWestConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies/wa-central"
          element={<WaCentralConstituencyHome />}
        />
        <Route
          path="/regions/upper-west/constituencies"
          element={<UpperWestConstituenciesList />}
        />
        <Route
          path="/regions/upper-east/constituencies/talensi"
          element={<TalensiConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/pusiga"
          element={<PusigaConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/binduri"
          element={<BinduriConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/tempane"
          element={<TempaneConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/garu"
          element={<GaruConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/bawku-central"
          element={<BawkuCentralConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/zebilla"
          element={<ZebillaConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/nabdam"
          element={<NabdamConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/bongo"
          element={<BongoConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/bolga-east"
          element={<BolgaEastConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/bolgatanga-central"
          element={<BolgatangaCentralConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/chiana-paga"
          element={<ChianaPagaConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/navrongo-central"
          element={<NavrongoCentralConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/builsa-north"
          element={<BuilsaNorthConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies/builsa-south"
          element={<BuilsaSouthConstituencyHome />}
        />
        <Route
          path="/regions/upper-east/constituencies"
          element={<UpperEastConstituenciesList />}
        />
        <Route
          path="/regions/savannah/constituencies/salaga-north"
          element={<SalagaNorthConstituencyHome />}
        />
        <Route
          path="/regions/savannah/constituencies/salaga-south"
          element={<SalagaSouthConstituencyHome />}
        />
        <Route
          path="/regions/savannah/constituencies/yapei-kusawgu"
          element={<YapeiKusawguConstituencyHome />}
        />
        <Route
          path="/regions/savannah/constituencies/daboya-mankarigu"
          element={<DaboyaMankariguConstituencyHome />}
        />
        <Route
          path="/regions/savannah/constituencies/damongo"
          element={<DamongoConstituencyHome />}
        />
        <Route
          path="/regions/savannah/constituencies/sawla-tuna-kalba"
          element={<SawlaTunaKalbaConstituencyHome />}
        />
        <Route
          path="/regions/savannah/constituencies/bole-bamboi"
          element={<BoleBamboiConstituencyHome />}
        />
        <Route
          path="/regions/savannah/constituencies"
          element={<SavannahConstituenciesList />}
        />
        <Route
          path="/regions/oti/constituencies/guan"
          element={<GuanConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies/nkwanta-north"
          element={<NkwantaNorthConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies/nkwanta-south"
          element={<NkwantaSouthConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies/krachi-nchumuru"
          element={<KrachiNchumuruConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies/krachi-west"
          element={<KrachiWestConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies/krachi-east"
          element={<KrachiEastConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies/akan"
          element={<AkanConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies/biakoye"
          element={<BiakoyeConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies/buem"
          element={<BuemConstituencyHome />}
        />
        <Route
          path="/regions/oti/constituencies"
          element={<OtiConstituenciesList />}
        />
        <Route
          path="/regions/north-east/constituencies/chereponi"
          element={<ChereponiConstituencyHome />}
        />
        <Route
          path="/regions/north-east/constituencies/yunyoo"
          element={<YunyooConstituencyHome />}
        />
        <Route
          path="/regions/north-east/constituencies/bunkpurugu"
          element={<BunkpuruguConstituencyHome />}
        />
        <Route
          path="/regions/north-east/constituencies/nalerigu-gambaga"
          element={<NaleriguGambagaConstituencyHome />}
        />
        <Route
          path="/regions/north-east/constituencies/yagaba-kubori"
          element={<YagabaKuboriConstituencyHome />}
        />
        <Route
          path="/regions/north-east/constituencies/walewale"
          element={<WalewaleConstituencyHome />}
        />
        <Route
          path="/regions/north-east/constituencies"
          element={<NorthEastConstituenciesList />}
        />
        <Route
          path="/regions/northern/constituencies/kumbungu"
          element={<KumbunguConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/tolon"
          element={<TolonConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/tamale-north"
          element={<TamaleNorthConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/sagnarigu"
          element={<SagnariguConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/tamale-central"
          element={<TamaleCentralConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/gushegu"
          element={<GusheguConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/tamale-south"
          element={<TamaleSouthConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/nanton"
          element={<NantonConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/savelugu"
          element={<SaveluguConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/karaga"
          element={<KaragaConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/saboba"
          element={<SabobaConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/mion"
          element={<MionConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/yendi"
          element={<YendiConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/tatale-sanguli"
          element={<TataleSanguliConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/zabzugu"
          element={<ZabzuguConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/wulensi"
          element={<WulensiConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies/kpandai"
          element={<KpandaiConstituencyHome />}
        />
        <Route
          path="/regions/northern/constituencies"
          element={<NorthernConstituenciesList />}
        />
        <Route
          path="/regions/eastern/constituencies/kwahu-east"
          element={<KwahuEastConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/afram-plains-south"
          element={<AframPlainsSouthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/kwahu-afram-plains-north"
          element={<KwahuAframPlainsNorthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/mpraeso"
          element={<MpraesoConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/nkawkaw"
          element={<NkawkawConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/fanteakwa-south"
          element={<FanteakwaSouthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/fanteakwa-north"
          element={<FanteakwaNorthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/atiwa-east"
          element={<AtiwaEastConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/atiwa-west"
          element={<AtiwaWestConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/abuakwa-north"
          element={<AbuakwaNorthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/abuakwa-south"
          element={<AbuakwaSouthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/abirem"
          element={<AbiremConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/akwatia"
          element={<AkwatiaConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/kade"
          element={<KadeConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/ofoase-ayirebi"
          element={<OfoaseAyirebiConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/akyease"
          element={<AkyeaseConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/akim-swedru"
          element={<AkimSwedruConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/asene-akroso-manso"
          element={<AseneAkrosoMansoConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/akim-oda"
          element={<AkimOdaConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/upper-west-akim"
          element={<UpperWestAkimConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/lower-west-akim"
          element={<LowerWestAkimConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/ayensuano"
          element={<AyensuanoConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/suhum"
          element={<SuhumConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/nsawam-adoagyiri"
          element={<NsawamAdoagyiriConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/akuapem-south"
          element={<AkuapemSouthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/okere"
          element={<OkereConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/akropong"
          element={<AkropongConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/new-juaben-north"
          element={<NewJuabenNorthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/new-juaben-south"
          element={<NewJuabenSouthConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/yilo-krobo"
          element={<YiloKroboConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/upper-manya-krobo"
          element={<UpperManyaKroboConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/lower-manya-krobo"
          element={<LowerManyaKroboConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies/asuogyaman"
          element={<AsuogyamanConstituencyHome />}
        />
        <Route
          path="/regions/eastern/constituencies"
          element={<EasternConstituenciesList />}
        />
        <Route
          path="/regions/central/constituencies/upper-denkyira-east"
          element={<UpperDenkyiraEastConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/upper-denkyira-west"
          element={<UpperDenkyiraWestConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/hemang-lower-denkyira"
          element={<HemangLowerDenkyiraConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/twifo-atti-morkwa"
          element={<TwifoAttiMorkwaConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/assin-south"
          element={<AssinSouthConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/assin-north"
          element={<AssinNorthConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/assin-central"
          element={<AssinCentralConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/asikuma-odoben-brakwa"
          element={<AsikumaOdobenBrakwaConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/agona-west"
          element={<AgonaWestConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/agona-east"
          element={<AgonaEastConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/awutu-senya-east"
          element={<AwutuSenyaEastConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/awutu-senya-west"
          element={<AwutuSenyaWestConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/effutu"
          element={<EffutuConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/gomoa-east"
          element={<GomoaEastConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/gomoa-west"
          element={<GomoaWestConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/gomoa-central"
          element={<GomoaCentralConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/ajumako-enyan-essiam"
          element={<AjumakoEnyanEssiamConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/ekumfi"
          element={<EkumfiConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/mfantseman"
          element={<MfantsemanConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/abura-asebu-kwamankese"
          element={<AburaAsebuKwamankeseConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/cape-coast-north"
          element={<CapeCoastNorthConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/cape-coast-south"
          element={<CapeCoastSouthConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies/komenda-edina-eguafo-abrem"
          element={<KomendaEdinaEguafoAbremConstituencyHome />}
        />
        <Route
          path="/regions/central/constituencies"
          element={<CentralConstituenciesList />}
        />
        <Route
          path="/regions/bono-east/constituencies/atebubu-amantin"
          element={<AtebubuAmantinConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/techiman-south"
          element={<TechimanSouthConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/techiman-north"
          element={<TechimanNorthConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/sene-west"
          element={<SeneWestConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/sene-east"
          element={<SeneEastConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/pru-west"
          element={<PruWestConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/nkoranza-south"
          element={<NkoranzaSouthConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/pru-east"
          element={<PruEastConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/nkoranza-north"
          element={<NkoranzaNorthConstituencyHome />}
        />

        <Route
          path="/regions/bono-east/constituencies/kintampo-south"
          element={<KintampoSouthConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies/kintampo-north"
          element={<KintampoNorthConstituencyHome />}
        />
        <Route
          path="/regions/bono-east/constituencies"
          element={<BonoEastConstituenciesList />}
        />
        <Route
          path="/regions/bono/constituencies/banda"
          element={<BandaConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/wenchi"
          element={<WenchiConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/tain"
          element={<TainConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/jaman-north"
          element={<JamanNorthConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/jaman-south"
          element={<JamanSouthConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/berekum-west"
          element={<BerekumWestConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/berekum-east"
          element={<BerekumEastConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/dormaa-west"
          element={<DormaaWestConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/dormaa-east"
          element={<DormaaEastConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/dormaa-central"
          element={<DormaaCentralConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/sunyani-west"
          element={<SunyaniWestConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies/sunyani-east"
          element={<SunyaniEastConstituencyHome />}
        />
        <Route
          path="/regions/bono/constituencies"
          element={<BonoConstituencies />}
        />
        <Route
          path="/regions/ashanti/constituencies/Afigya-Sekyere-East"
          element={<AfigyaSekyereEastConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/asawase"
          element={<AsawaseConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/Manso-Adubia"
          element={<MansoAdubiaConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/Manso-Nkwanta"
          element={<MansoNkwantaConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/kumawu"
          element={<KumawuConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/Akrofuom"
          element={<AkrofuomConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/Effiduase-Asokore"
          element={<EffiduaseAsokoreConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/sekyere-afram-plains"
          element={<SekyereAframPlainsConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/subin"
          element={<SubinConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/suame"
          element={<SuameConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/kwadaso"
          element={<KwadasoConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/juaben"
          element={<JuabenConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/bantama"
          element={<BantamaConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/odotobri"
          element={<OdotobriConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/old-tafo"
          element={<OldTafoConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/oforikrom"
          element={<OforikromConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/offinso-south"
          element={<OffinsoSouthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/offinso-north"
          element={<OffinsoNorthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/obuasi-west"
          element={<ObuasiWestConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/obuasi-east"
          element={<ObuasiEastConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/nsuta-kwamang-beposo"
          element={<NsutaKwamangBeposoConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/nhyiaeso"
          element={<NhyiaesoConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/new-edubiase"
          element={<NewEdubiaseConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/manhyia-south"
          element={<ManhyiaSouthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/manhyia-north"
          element={<ManhyiaNorthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/mampong"
          element={<MampongConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/kwabre-east"
          element={<KwabreEastConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/fomena"
          element={<FomenaConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/ejura-sekyedumase"
          element={<EjuraSekyedumaseConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/ejisu"
          element={<EjisuConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/bosomtwe"
          element={<BosomtweConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/bosome-freho"
          element={<BosomeFrehoConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/bekwai"
          element={<BekwaiConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/atwima-nwabiagya-south"
          element={<AtwimaNwabiagyaSouthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/atwima-nwabiagya-north"
          element={<AtwimaNwabiagyaNorthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/atwima-mponua"
          element={<AtwimaMponuaConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/atwima-kwanwoma"
          element={<AtwimaKwanwomaConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/asokwa"
          element={<AsokwaConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/asante-akim-south"
          element={<AsanteAkimSouthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/asante-akim-north"
          element={<AsanteAkimNorthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/asante-akim-central"
          element={<AsanteAkimCentralConstituencyHome />}
        />

        <Route
          path="/regions/ashanti/constituencies/ahafo-ano-south-west"
          element={<AhafoAnoSouthWestConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/ahafo-ano-south-east"
          element={<AhafoAnoSouthEastConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/ahafo-ano-north"
          element={<AhafoAnoNorthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/afigya-kwabre-south"
          element={<AfigyaKwabreSouthConstituencyHome />}
        />

        <Route
          path="/regions/ashanti/constituencies/afigya-kwabre-north"
          element={<AfigyaKwabreNorthConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies/adansi-asokwa"
          element={<AdansiAsokwaConstituencyHome />}
        />
        <Route
          path="/regions/ashanti/constituencies"
          element={<AshantiConstituenciesList />}
        />
        <Route
          path="/regions/ahafo/constituencies/tano-south"
          element={<TanoSouthConstituencyHome />}
        />
        <Route
          path="/regions/ahafo/constituencies/tano-north"
          element={<TanoNorthConstituencyHome />}
        />
        <Route
          path="/regions/ahafo/constituencies/asutifi-south"
          element={<AsutifiSouthConstituencyHome />}
        />
        <Route
          path="/regions/ahafo/constituencies/asutifi-north"
          element={<AsutifiNorthConstituencyHome />}
        />
        <Route
          path="/regions/ahafo/constituencies/asunafo-south"
          element={<AsunafoSouthConstituencyHome />}
        />
        <Route
          path="/regions/ahafo/constituencies"
          element={<ConstituenciesList />}
        />
        <Route
          path="/regions/ahafo/constituencies/asunafo-north"
          element={<AsunafoNorthConstituencyHome />}
        />
        {/* 🔐 Generic Login */}
        <Route path="/login" element={<Login />} />

        {/* Regional Blog Login → goes to same login component */}
        <Route path="/regions/:region/login" element={<Login />} />

        {/* Constituency Blog Login → goes to same login component */}
        <Route
          path="/regions/:region/constituencies/:constituency/login"
          element={<Login />}
        />

        {/* National Blog Admin */}
        <Route path="/blog/admin" element={<BlogAdminDashboard />} />

        {/* Regional Blog Admin */}
        <Route path="/regions/:region/blog/admin" element={<BlogAdminDashboard />} />

        {/* Constituency Blog Admin */}
        <Route
          path="/regions/:region/constituencies/:constituency/blog/admin"
          element={<BlogAdminDashboard />}
        />

        {/* Blog Admin Form (for create/edit) */}
        <Route path="/blog/admin/new" element={<BlogForm />} />
        <Route path="/blog/admin/edit/:id" element={<BlogForm />} />

        {/* Public Blog */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/regions/:region/blog" element={<BlogPage />} />
        <Route path="/regions/:region/constituencies/:constituency/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/regions/:region/blog/:id" element={<BlogPostPage />} />
        <Route path="/regions/:region/constituencies/:constituency/blog/:id" element={<BlogPostPage />} />
        <Route path="/projects/admin" element={<ProjectsAdmin />} />
        <Route path="/regions/oti" element={<OtiRegionHome />} />

        // Donate
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/regions/:region/donate" element={<DonatePage />} />
        <Route path="/regions/:region/constituencies/:constituency/donate" element={<DonatePage />} />

        // Projects
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/regions/:region/projects" element={<ProjectsPage />} />
        <Route path="/regions/:region/constituencies/:constituency/projects" element={<ProjectsPage />} />

        <Route path="/regions/:region/executives" element={<RegionalExecutivesPage />} />
        <Route path="/regions/:region/constituencies/:constituency/mmdce" element={<ConstituencyMMDCEPage />} />

        <Route
          path="/regions/greater-accra/constituencies/amasaman"
          element={<AmasamanConstituencyHome />}
        />
        <Route
          path="/regions/:region/constituencies/:constituency/mp"
          element={<ConstituencyMPPage />}
        />
        <Route
          path="/regions/greater-accra/constituencies/kpone-katamanso"
          element={<KponeKatamansoConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/okaikwei-central"
          element={<OkaikweiCentralConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/domeabra-obom"
          element={<DomeabraObomConstituencyHome />}
        />

        <Route
          path="/regions/greater-accra/constituencies/korle-klottey"
          element={<KorleKlotteyConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/krowor"
          element={<KroworConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ledzokuku"
          element={<LedzokukuConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ningo-prampram"
          element={<NingoPrampramConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/odododiodioo"
          element={<OdododiodiooConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/okaikwei-north"
          element={<OkaikweiNorthConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/okaikwei-south"
          element={<OkaikweiSouthConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/tema-central"
          element={<TemaCentralConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/tema-east"
          element={<TemaEastConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/tema-west"
          element={<TemaWestConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/dadekotopon"
          element={<DadekotoponConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ayawaso-north"
          element={<AyawasoNorthConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ashaiman"
          element={<AshaimanConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ayawaso-central"
          element={<AyawasoCentralConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ayawaso-west-wuogon"
          element={<AyawasoWestWuogonConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ayawaso-east"
          element={<AyawasoEastConstituencyHome />}
        />

        <Route
          path="/regions/greater-accra/constituencies/weija-gbawe"
          element={<WeijaGbaweConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ablekuma-south"
          element={<AblekumaSouthConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ablekuma-central"
          element={<AblekumaCentralConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ablekuma-west"
          element={<AblekumaWestConstituencyHome />}
        />

        <Route
          path="/regions/greater-accra/constituencies/ablekuma-north"
          element={<AblekumaNorthConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ablekuma-central"
          element={<AblekumaCentralConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ablekuma-west"
          element={<AblekumaWestConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/shai-osudoku"
          element={<ShaiOsudokuConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/sege"
          element={<SegeConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/ada"
          element={<AdaConstituencyHome />}
        />

        {/* Greater Accra Constituencies */}
        <Route
          path="/regions/greater-accra/constituencies/trobu"
          element={<TrobuConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/anyaa-sowutuom"
          element={<AnyaaSowutuomConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/bortianor-ngleshie-amanfro"
          element={<BortianorNgleshieAmanfroConstituencyHome />}
        />

        <Route
          path="/regions/greater-accra/constituencies/adenta"
          element={<AdentaConstituencyHome />}
        />
        <Route
          path="/regions/greater-accra/constituencies/madina"
          element={<MadinaConstituencyHome />}
        />
        <Route
          path="/regions/:region/constituencies/:constituency/executives"
          element={<ConstituencyExecutivesPage />}
        />

        <Route
          path="/regions/:region/constituencies/:constituency/council-of-elders"
          element={<ConstituencyEldersPage />}
        />
        <Route
          path="/national/executives/n-executives-2016_2020"
          element={<Executives2016_2020 />}
        />
        <Route
          path="/national/executives/n-executives-2000_2004"
          element={<Executives2000_2004 />}
        />

        <Route
          path="/national/executives/n-executives-2024-2428"
          element={<NExecutives2024_2028 />}
        />
        <Route
          path="/national/executives/n-executives-2012_2016"
          element={<Executives2012_2016 />}
        />
        <Route
          path="/national/executives/n-executives-2008_2012"
          element={<Executives2008_2012 />}
        />
        <Route
          path="/national/executives/n-executives-1992_1996"
          element={<Executives1992_1996 />}
        />
        <Route
          path="/national/executives/n-executives-1996_2000"
          element={<Executives1996_2000 />}
        />
        <Route
          path="/national/executives/n-executives-2004_2008"
          element={<Executives2004_2008 />}
        />
        <Route
          path="/national/executives/n-executives-2020_2024"
          element={<Executives2020_2024 />}
        />

        <Route
          path="/national/council-of-elders/n-council-1992_1996"
          element={<NCouncil1992_1996 />}
        />
        <Route
          path="/national/council-of-elders/n-council-1996_2000"
          element={<NCouncil1996_2000 />}
        />
        <Route
          path="/national/council-of-elders/n-council-2000_2004"
          element={<NCouncil2000_2004 />}
        />
        <Route
          path="/national/council-of-elders/n-council-2004_2008"
          element={<NCouncil2004_2008 />}
        />
        <Route
          path="/national/council-of-elders/n-council-2008_2012"
          element={<NCouncil2008_2012 />}
        />
        <Route
          path="/national/council-of-elders/n-council-2012_2016"
          element={<NCouncil2012_2016 />}
        />
        <Route
          path="/national/council-of-elders/n-council-2016_2020"
          element={<NCouncil2016_2020 />}
        />
        <Route
          path="/national/council-of-elders/n-council-2020_2024"
          element={<NCouncil2020_2024 />}
        />
        <Route
          path="/national/council-of-elders/n-council-2024_2028"
          element={<NCouncil2024_2028 />}
        />
        <Route
          path="/regions/:region/council-of-elders"
          element={<RegionalEldersPage />}
        />

        <Route path="/tools/polling-formatter" element={<PollingStationFormatter />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* National Pages */}
        <Route path="/nhqt" element={<NationalHQPage />} />
        <Route path="/presidents" element={<Presidents />} />
        <Route path="/executives" element={<NationalExecutives />} />
        <Route path="/elders" element={<CouncilOfElders />} />
        <Route path="/author-profile" element={<AuthorProfile />} />
        <Route path="/founding-fathers" element={<FoundingFathers />} />
        <Route path="/projects" element={<NationalProjects />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/self-placement" element={<UserSelfPlacement />} />

        {/* G Accra Region Pages */}
        <Route path="/regions/greater-accra" element={<GreaterAccraRegion />} />
        <Route path="/regions/greater-accra/constituencies" element={<GreaterAccraConstituenciesList />} />

        <Route path="/polling-stations/:code" element={<PollingStationViewer />} />

        <Route
          path="/regions/:region/constituencies/:constituency/c-dinators"
          element={<CoordinatorsPage />}
        />
        <Route
          path="/regions/greater-accra/constituencies/dome-kwabenya"
          element={<DomeKwabenya />}
        />
        {/* Eastern Region Pages */}
        <Route path="/regions/eastern" element={<EasternRegion />} />
        <Route path="/regions/eastern/constituencies" element={<EasternConstituencies />} />
        <Route path="/regions/greater-accra/constituencies/dome-kwabenya" element={<DomeKwabenya />} />

        <Route path="/regions/ashanti" element={<AshantiRegionHome />} />
        <Route path="/regions/central" element={<CentralRegionHome />} />
        <Route path="/regions/ahafo" element={<AhafoRegionHome />} />
        <Route path="/regions/bono" element={<BonoRegionHome />} />
        <Route path="/regions/bono-east" element={<BonoEastRegionHome />} />
        <Route path="/regions/northern" element={<NorthernRegionHome />} />
        <Route path="/regions/north-east" element={<NorthEastRegionHome />} />
        <Route path="/regions/savannah" element={<SavannahRegionHome />} />
        <Route path="/regions/upper-east" element={<UpperEastRegionHome />} />
        <Route path="/regions/upper-west" element={<UpperWestRegionHome />} />
        <Route path="/regions/volta" element={<VoltaRegionHome />} />
        <Route path="/regions/western" element={<WesternRegionHome />} />
        <Route path="/regions/western-north" element={<WesternNorthRegionHome />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/regions/:region/constituencies/:constituency/executives" element={<ConstituencyExecutivesPage />} />

        <Route
          path="/regions/:region/constituencies/:constituency/polling-stations"
          element={<PollingStationsPage />} />

          {/* Protected route for dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["executive", "admin", "supporter"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Regions Overview and Others */}
{/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
}

export default App;
