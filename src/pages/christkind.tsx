import { Link } from "gatsby";
import React, { useState, MouseEvent } from "react";

const valid_ids = [
  "VRRTQOFF",
  "WABJDMAV",
  "MMQIHBIH",
  "KFFLAKWD",
  "USFKCFUB",
  "VUEJHICF",
  "XGCMMAMM",
  "YGTLUCYO",
  "NTZKXTAW",
  "SCGSPPHI",
  "YXOHUBMA",
  "PDBRZJYU",
  "NJZWFEAW",
  "NRKQWQPA",
  "GGEUMBPM",
  "TPVJNEFM",
  "RUXLSMPO",
  "XRDPAIUR",
  "GAJROPBM",
  "NCCVDLZJ",
  "WLFRCXAN",
  "XYLWKFFS",
  "MMLQCGOP",
  "AJXTYWBX",
  "VPMSBPHR",
  "EBIMZPHS",
  "TOEFOBGD",
  "QVGSHMIH",
  "UIJMDHXE",
  "UKPSYFND",
  "HPLQZGBA",
  "KRIVOZFB",
  "WVVYJEFI",
  "CFESFLNW",
  "WVCFCARX",
  "EIGUDRQB",
  "RWLHUGSP",
  "KNZOIUYU",
  "PZZNJYHL",
  "CYRQNPMS",
  "FRAGEYGJ",
  "RFXJXFYV",
  "IQVKDIRH",
  "FTEJOPGK",
  "VUOQVPLU",
  "DXJIKJYW",
  "ASYIWCGU",
  "MPLZZHWK",
  "OPFIDULX",
  "XTIOXJDN",
  "KVKNMXCW",
  "HKNAIVVO",
  "MKZKQQUT",
  "CREAUBAG",
  "RRSKBMUT",
  "JIFDBJJQ",
  "ARZPQWHR",
  "CECBRTAL",
  "BYGYXZDJ",
  "GGGMHBLD",
  "DAHBFVGB",
  "ASGXYGVX",
  "IRITHOIM",
  "BRPMETAE",
  "OXFMQCWZ",
  "NTKKJEKD",
  "DGTYISKG",
  "ENJQRTDV",
  "EVCBATIJ",
  "LVLWOYUX",
  "PQEDCOQI",
  "UASZEDCQ",
  "TFMSLWOH",
  "YSMDTLFA",
  "POSJPFJG",
  "BOYSLUJA",
  "ABTGYKEJ",
  "CVPURRYT",
  "YDZHQXIY",
  "FICONRBN",
  "AFDNEITJ",
  "DDYUDEFX",
  "MAPAZAVE",
  "ZURJQZXN",
  "VRCLDHNX",
  "ELDZJJUZ",
  "RTTBKDQR",
  "SJUAGGVB",
  "QFMKMAMD",
  "TQKHABDE",
  "KJXRKFWV",
  "EUTRHRSK",
  "EPQJSTGF",
  "YYCUGXCG",
  "CTHGQPPY",
  "OTQHBZKY",
  "VLVMZASV",
  "YVBZPVPR",
  "NVDSLGRE",
  "ZWXOAWAC",
  "IEWQIXMK",
  "MFBBFWSP",
  "RXJRNPIZ",
  "VZERXEKV",
  "MTPRDPZA",
  "TFEQIVFY",
  "XYIJXSRU",
  "CPRYDNUV",
  "DYWGKFGZ",
  "TGDXJWRZ",
  "DMNESRSB",
  "CVODTQII",
  "BDWKTTCW",
  "HSRIMWJN",
  "SMHIHOAY",
  "RZYEGBEK",
  "LLHVJZBG",
  "RAQHHNPC",
  "KJLIYCXB",
  "WHOLQDXL",
  "FZTPIXJH",
  "WUSODQHD",
  "SBRKRPMD",
  "QCOZASDG",
  "WGOYWSWP",
  "XSSOEXSS",
  "EYNFEPHY",
  "ZRXELNMG",
  "PIGJOZMU",
  "EELZFQRO",
  "CMUREATU",
  "JNJYGQCU",
  "CJSZSUNJ",
  "CXFXVZCW",
  "RYZASTTI",
  "KVVGYANK",
  "AVNRLPJM",
  "HNEAWCZB",
  "RDDJDJUI",
  "TFDHTCDV",
  "QDTBETAQ",
  "PNSAONQU",
  "JKPVUZZA",
  "SAGUGCZO",
  "XWHLRYKW",
  "TYVLIWGD",
  "OXUXFQLA",
  "ZEYDGNGV",
  "RIMWLYAD",
  "BGEHJNSB",
  "QUORQGDZ",
  "BFWPLISK",
  "FSONRNUE",
  "QLCVGEGF",
  "KDTXJAZB",
  "BGLOKJQS",
  "LZJDEKDA",
  "WFFQHRHZ",
  "LOBLXXXI",
  "VYYKNYKE",
  "JDAVDKHG",
  "BOZKONEG",
  "JJWTSLMC",
  "YVHWPICJ",
  "XCDMREGF",
  "PRCCCZWN",
  "SBTZIZKK",
  "JBLHBCVV",
  "MMXAVTTY",
  "QNYUKJHK",
  "GOBZNFCM",
  "ZBURUCXF",
  "LPMAQGOP",
  "AUNMUPTY",
  "SWFHRFQS",
  "SYFQUNBM",
  "FYVQGAKW",
  "YABIUVPU",
  "RZBWLKJU",
  "TBFEAWRC",
  "IJXZEVRG",
  "WTPKLCXY",
  "EHQTEZSH",
  "YALYUKXU",
  "CYEPKITT",
  "GQECIKLX",
  "TTKRZEWV",
  "HAKPBBMH",
  "MCKLCNJA",
  "QOWDGOZQ",
  "EYQVIGSS",
  "GUBCXJAT",
  "YBIFCLFS",
  "YIYWOGSQ",
  "ITAOLODZ",
  "CBWASAUC",
  "UUXQWBOZ",
  "FNGISCNL",
  "DBXMFAEK",
  "MEQRRWKK",
  "IFKPQZWF",
  "GPMMCSTO",
  "WQZLZBPQ",
  "FLWGTXIC",
  "UHYMDHCL",
  "FFAQUYJI",
  "UPROWZYU",
  "SOSDUZWO",
  "SVPLGKHB",
  "IRLGUHZW",
  "MAHODOGM",
  "TVBGLZJH",
  "ZOKLMKXF",
  "QYJEPKSM",
  "CPMEYQSD",
  "ONRZYQBN",
  "SOFHFTWN",
  "YCKJZOKP",
  "FZGTOAFQ",
  "IFTZOPTI",
  "XBEHDJAO",
  "ACCETGPS",
  "JYVLWOBE",
  "BZMMYAMF",
  "BVFWDESZ",
  "OBOHNIEI",
  "NCRVCFTH",
  "OYCYEVIX",
  "YFKMHZTU",
  "QSVNSZWH",
  "AEIWKWGH",
  "WTILDHCZ",
  "DXFNGTFC",
  "YBWOVLBK",
  "MACSEQKP",
  "HHJYEVXV",
  "CKSPNVSR",
  "QDGFTJTS",
  "IPOQLPYP",
  "TAKDYRYD",
  "CMBEFYSP",
  "MIYWYCHZ",
  "KRMGDILS",
  "NJNYUXSU",
  "XXLLMIAU",
  "AVFPAPJJ",
  "DWENJPDA",
  "RGFUGEVI",
  "QOAVANKS",
  "OKRIEJUV",
  "WVHEUMZN",
  "TEEWPCAV",
  "SRVSFBYB",
  "DVGWXUFN",
  "YNPGVYLA",
  "ITLZGDDX",
  "BECSXMHE",
  "VMCAVAET",
  "YVNTDAZX",
  "VGDZXVME",
  "ECHQGAXG",
  "LYHEPUOP",
  "YFPEFVRR",
  "QTRLEAWN",
  "JUYUWGUR",
  "FTQDKPYG",
  "BBUXLUBY",
  "GKHOMJQQ",
  "BBGOZONS",
  "MOPUDSLA",
  "AYADOKBG",
  "YLGCVIWK",
  "GHCSIZAS",
  "JMJRPUVN",
  "WZLHLKAG",
  "CDOHUWOV",
  "PHELDGCU",
  "QZEJHNAO",
  "YRMSNGWW",
  "RDAAXULQ",
  "GZTAGOJN",
  "HJOITSKJ",
  "GXSDBWBP",
  "JCWYBZKC",
  "FUTPIKRH",
  "DQWIWKCW",
  "UWCKXKZC",
  "HSEJCTAP",
  "PVYMUIVH",
  "QMOXHIUH",
  "STBYTHFE",
  "FIEMXYFI",
  "MUVVWCZF",
  "RTAHAJLE",
  "ZAOYOWQD",
  "AJZEOYQX",
  "BSUPUOUD",
  "SCJPWGTT",
  "HISXGRJY",
  "KICAQCUK",
  "BLXYZPID",
  "WGZXJQBJ",
  "UWPGWMJT",
  "YSNSSAPN",
  "SDPJRQOL",
  "TXTTWJOF",
  "KAFUVWEG",
  "HDEYPRXL",
  "LIKLGQBX",
  "DDCBAJUL",
  "NDPIXBKA",
  "EEZDUHSZ",
  "TPTKCLLC",
  "CYFDVWIQ",
  "BJOYCTWB",
  "VTUASPTB",
  "WDASDIUH",
  "FGGBWQPW",
  "HKMCTWIU",
  "VFVBEOXG",
  "FAFAPOVA",
  "SDVCYJOE",
  "XLJZQXLY",
  "AQCEPSMI",
  "ITXZDAHX",
  "ZWMTTPCE",
  "MFDQQDHJ",
  "KLYSSSGA",
  "ETCEWCFI",
  "GMYEZFPZ",
  "PXRLAXEB",
  "ZFLZEGPS",
  "NMHWQHOW",
  "FEPBZTTY",
  "GAOOTMVV",
  "AZPRPKOX",
  "XUYQFKJT",
  "ZNOPCNTJ",
  "TFHKIIWZ",
  "XLQZBULX",
  "DYQTUEJX",
  "RSBWFPDF",
  "PDRPCFHW",
  "XDARLBMN",
  "XFWDIIYF",
  "CPSMTRBA",
  "DBLPIFJQ",
  "KKBEFRJY",
  "HWKQKQBK",
  "TFUYXUUF",
  "DRBSXZJD",
  "FUIOPMLF",
  "FPCPTCTZ",
  "JFDGVPPS",
  "PEBBMXRM",
  "EOBLWDUV",
  "GUCIIWKU",
  "DTMVQSEF",
  "HNZTHMEJ",
  "CAVVVFXP",
  "FVZXEQWG",
  "UTXHPCKV",
  "GUBHNQFZ",
  "OUTTCCZJ",
  "TJVFZGCN",
  "CMLDEOWS",
  "NVGGJCPI",
  "LUCRYKMU",
  "XSEPFPCZ",
  "PEEOIHEG",
  "WRMTKSUD",
  "EYBIEQRZ",
  "HEMDPEYM",
  "TBUSLCPE",
  "BCLIGEAQ",
  "TIPHSONA",
  "VCNFYQPF",
  "VIAICUMH",
  "TPFZRKGV",
  "UKJMLNYV",
  "IGLZKETC",
  "DADBBVDR",
  "QMKRCSLR",
  "EZNHAKIC",
  "YMHHGKLN",
  "WNCDAPOD",
  "ENLTJLHQ",
  "ZFFIQRKJ",
  "ZAONQWVW",
  "BRNUEUVC",
  "NCHOLZQA",
  "TCRVBMSE",
  "IQZHVCUM",
  "EVJTRYXB",
  "CHTMXUNL",
  "PYKNXVBE",
  "YXTILHWA",
  "RHFPVUAA",
  "HAZESEVU",
  "YXGQQJPK",
  "JKVCTDNB",
  "HXEGUYFU",
  "TJNKPTYN",
  "EGTDJNZP",
  "PHVMAZJH",
  "FLTMKGUH",
  "HBEWWNES",
  "KRJKVNTV",
  "EQRTEKVA",
  "OTWDPSHV",
  "KNYPFYLK",
  "QCULTOZP",
  "SDUDJXFS",
  "PKKKJKCZ",
  "UHCVJHJY",
  "FIUKDOJZ",
  "GCUPTRUW",
  "DUYVTHFS",
  "GODZYEDQ",
  "GLETWGIK",
  "AAZTLPBH",
  "HKUBKWRX",
  "PERSGPQV",
  "EDKWRXTU",
  "IJNEILSN",
  "DYIQKEXF",
  "ZQLRYLTR",
  "ILMUJDJJ",
  "QIALJVVA",
  "IAZAIPCY",
  "XLXTPKIL",
  "CGKXOUQJ",
  "VVZUBRML",
  "GACXDYXL",
  "PGKTYXBH",
  "BHFTLZTC",
  "NDJQVKOQ",
  "DWVRFSZL",
  "ZNNDZLSJ",
  "DQPYBYUW",
  "FPTGZHPX",
  "SEKNPXNG",
  "ZMUUQQZV",
  "OHDGWZPB",
  "TQTIMKMN",
  "XWNVDFAU",
  "GOSKLVYL",
  "HLDQQPTH",
  "ZUJZKGGZ",
  "VZJUYOXI",
  "FZDAMSLE",
  "RGGNHFXJ",
  "QPBLNWFI",
  "ZOOQZUJZ",
  "KWNPVPET",
  "OJTCPDYP",
  "DSJRRQKI",
  "PWJUWVEO",
  "HBSSXOQY",
  "EVBLUBUM",
  "UXPMOFOS",
  "AOMVEOYH",
  "WDPNCGTY",
  "HFHAXVFO",
  "SRHJGUJZ",
  "GXAHDEMW",
  "YZFLKVSY",
  "IQAUXMVE",
  "CIHSMXQW",
  "GPYQNNUK",
  "FHQBOURN",
  "PWVINUQE",
  "LVRYBLBP",
  "DVTUZEOL",
  "WRPMMADY",
  "HTZAPSYF",
  "NQJXXETU",
  "UBGWGZNP",
  "XSONFZXI",
  "PEZZSQOG",
  "MRFEOMPR",
  "KJYRJJFR",
  "LXDTYKNF",
  "RIHWQJKR",
  "DHRLHXNP",
  "EPSJLAST",
  "KMPRWXGX",
  "KXGCGCQI",
  "NOTCBORT",
  "YBDWMTCM",
  "TKWAMSWB",
  "TKZAUKWA",
  "BCWNVJVA",
  "CUHFLRRT",
  "PUUJTCOR",
  "KBGRICVD",
  "UUBUNIHH",
  "TDCZZTPZ",
  "FKNKUKDO",
  "EMVYZQUV",
  "TWKOLHNM",
  "HAMNUYQF",
  "HKZPMDTP",
  "DDPQGEGP",
  "NAPDJIVB",
  "GEFUUTBP",
  "LBIMKGWN",
  "KRLFLVKZ",
  "BMJFEUCG",
  "DFCHLAXJ",
  "XDILPNLJ",
  "ZHGACVRY",
  "IVDQKOIN",
  "EOPUIUVU",
  "NGZJIKRK",
  "ABPCXDUQ",
  "WSQHDBWV",
  "OARPQHSC",
  "RTABZFJC",
  "TKRGOFYF",
  "DVRSYHPC",
  "RSITBLML",
  "YWDNHOFO",
  "AADGEPOH",
  "KSTUPYIK",
  "UZAICOCF",
  "RZAFFCIQ",
  "FFCQYMNC",
  "RLDHSMJO",
  "ULONAOTI",
  "JEKEXDQJ",
  "GIANXPFK",
  "KCYPJGIK",
  "KEXQTDQJ",
  "PIQSVFKV",
  "BUHDNLAV",
  "ZVVQCLZA",
  "BJTVPURW",
  "TNCIDOPC",
  "IVHRGDXF",
  "TRWLVUKQ",
  "JTPKRWOK",
  "NASPZOJD",
  "AEZQAIDV",
  "YYQDABRT",
  "GLRVFQKI",
  "GDSCXDGN",
  "FIIXKCAC",
  "PQTJWCCJ",
  "GDMZRNSB",
  "ZGIHMSZQ",
  "TSRODXSD",
  "GVIBOFKX",
  "BSJMKJAF",
  "CZOBQODW",
  "YOVDAPIA",
  "ODAFACEY",
  "SKRCFSQA",
  "MIANSISW",
  "EPMPCFYK",
  "BXBROVJQ",
  "QOIWAGRF",
  "DXZLHOTB",
  "BHSHSPLA",
  "LDDOAQOX",
  "QKBYSQGS",
  "NMIQSDWA",
  "OLDDWOMS",
  "KHTGIIOQ",
  "VOGXUXGP",
  "SWYQNXIM",
  "EUVBGIAL",
  "JVGWIMHT",
  "DVPAHJJI",
  "IOWWJRYZ",
  "OWDSFLAZ",
  "WWQSRWAN",
  "XTBDQTIW",
  "VFNXZMWG",
  "LLCVETQE",
  "EJKTCMAC",
  "FFIBABYB",
  "YRLGNTHJ",
  "HOGJBZZQ",
  "OYHAMTSN",
  "DFWMLVQM",
  "QKIKZSDJ",
  "CKPRVZCU",
  "EKPMBHHE",
  "WTXQVEOE",
  "VLKJOKCN",
  "RTPXEIDA",
  "NJNJGIZB",
  "ZUHCNQMK",
  "ZSCQWEIT",
  "OJYLNNSX",
  "UEWTOFTF",
  "BVEOHBSV",
  "AFNQAWJD",
  "WJWMDTVC",
  "KOXFXXFL",
  "CBYKASMB",
  "LFVDUEDV",
  "VYBOCDEV",
  "KKEFBNOK",
  "YWBIOEYJ",
  "JHRWNKSG",
  "SSVWUXRU",
  "ECOJTXPY",
  "WFYVMOWS",
  "IIQBOISR",
  "MVFCNAFG",
  "FWJRXKMO",
  "XMGOISCF",
  "IBRSKZVQ",
  "WDAFYXJD",
  "GEGPLQOK",
  "CGCUNQCE",
  "GFDRRTKD",
  "MQVSMMRM",
  "HZOUKOHT",
  "LFSDCWQS",
  "HENZIBQR",
  "WHZWNBNP",
  "QUQBFJAL",
  "HNTNGQXP",
  "SKCOVDZM",
  "ELVTMXAY",
  "SFLIPPAK",
  "MUHUXLXY",
  "COSRWINL",
  "UQCOQOSC",
  "FBPFZAHT",
  "GBIQIBUU",
  "SKGMFXLQ",
  "NWFJBJUK",
  "KDJEITTO",
  "SBDVGKFH",
  "QGORRBUQ",
  "WWZAWWAS",
  "AXRDOJGN",
  "TSSZBAKS",
  "LOPRGADG",
  "RGIWLORA",
  "FQZMHNIY",
  "BVQWYGYR",
  "UNLXDRSX",
  "QJFKSZPC",
  "ZUBBICHN",
  "BLPBQGWY",
  "KQKCVSTS",
  "LECHJSSA",
  "VFMPTHTN",
  "USUPEAUA",
  "LNLNRVMB",
  "XOQWFEQV",
  "DPHGVVXZ",
  "MLQDUDNR",
  "GECJFCJV",
  "AEDLAKPG",
  "WQWIUGID",
  "HZIHDGRE",
  "RHMWGOQR",
  "IQZJNNYH",
  "NBEPYXIW",
  "ULOSYLWU",
  "PXRIDOGR",
  "NGWCPMVY",
  "HPSJWCLV",
  "ILFCQLTV",
  "SAMNSCOD",
  "JQRVEPEG",
  "YXGULYYG",
  "XVNMSWIN",
  "LBGRPIUA",
  "RYWVHKHI",
  "XCTTOVND",
  "IOCRQLTK",
  "QKEZIMEV",
  "JDIDKAVA",
  "XHWIKTZB",
  "CYFVFREI",
  "OQHYZZYD",
  "VVGRTHMT",
  "BYPANIDE",
  "DVQSEZTR",
  "BZMGOEGV",
  "WVOFEHML",
  "BHUZKYIA",
  "FCTBOPYG",
  "BIBZQZZJ",
  "TUQQRTZH",
  "ZUNJFTOC",
  "TYRUAWOQ",
  "JGXACNIP",
  "RVLGEWSR",
  "TJSLXEKM",
  "TFVUYBXL",
  "BZBRAQKN",
  "TFJJBFGH",
  "NULPKIJP",
  "CAQZICMA",
  "HBOYPZJT",
  "POWEQBIS",
  "HZDXIRFK",
  "MWASAKQO",
  "MHGGIKZT",
  "CPFRSITI",
  "PXSJSWBG",
  "TPPEIFPM",
  "UVVQPUSI",
  "LIFPTEAS",
  "WWKBEUJI",
  "AMULOSHT",
  "VMQOGZOE",
  "XQSTMIUW",
  "NIYYDLGE",
  "GZZONCCG",
  "SJQODELK",
  "EHVZZQPF",
  "EJAVBBXE",
  "FGBTAZKM",
  "ITEWZZXB",
  "FWUVJDAK",
  "CULMARWJ",
  "COCQSHQX",
  "SMHGUJTP",
  "ZDUEMJMQ",
  "LSCWAIGH",
  "BZNXJFIK",
  "BOLXVKVN",
  "TYYDQDQS",
  "QWPHNMPG",
  "LAVBYVCA",
  "TXRPZSYA",
  "XRAABJWX",
  "TYPTQUWA",
  "ZRFQMSBH",
  "RXKOPBVZ",
  "WHURATPW",
  "DLFOSGYU",
  "JOSTJPBA",
  "VLUWNIQE",
  "SEBDPEPC",
  "RWZHJBXX",
  "RVBMKRUL",
  "XPHJPUGA",
  "EODSDPFM",
  "LCBEHLZX",
  "MUDGWVWP",
  "MDWCPUVD",
  "XHSJDTIV",
  "GADLLIXJ",
  "BMNIZIXX",
  "IMGFJIZF",
  "KZCAEREV",
  "KUYSTBMG",
  "CYIOJJFC",
  "XGUWILIG",
  "MUDSOZAI",
  "GKSJNDPO",
  "JTAHAOXJ",
  "GMEYBGYY",
  "NRGRJXYR",
  "QXJXRHTP",
  "DGTPKFMY",
  "VNZQHJCF",
  "KFGOEDLJ",
  "ATNQWPCT",
  "OBSUSMTE",
  "QIWPEHOY",
  "FTQBGKXD",
  "KBRVAAZY",
  "EFSXYGBE",
  "OINXOVEJ",
  "JRKKJYTJ",
  "UPTDHOVG",
  "ECVPDNZZ",
  "JHGDDZAC",
  "XZFSESDR",
  "LJQOZWBN",
  "DYZUUBDE",
  "HGGQFEQN",
  "HKBAOYCG",
  "WKFJNZBN",
  "IUGNDKNP",
  "WIWHPNDT",
  "VAVCLGUB",
  "JRKNYLQG",
  "KUKCQITR",
  "USPHZSBA",
  "QNDYRNCU",
  "PCCZEJBO",
  "HBNYNDXU",
  "CVHCZHEI",
  "QGTUTQIQ",
  "MICRAYIW",
  "QLSGTTBY",
  "PXTMNRJX",
  "PJBSCUGH",
  "SWZBULUF",
  "HZDJFEVF",
  "WIOZRVIF",
  "NYOFCOVV",
  "ADGVXIUW",
  "MVWBLMJD",
  "WAHISJPJ",
  "VNDZSQDE",
  "IPQOKJMN",
  "GSMMYYDQ",
  "BGVNFWFP",
  "TZTFFDHD",
  "SGZBBSVA",
  "WLNODVJH",
  "YKPHKIWI",
  "IDCTCANP",
  "FJOFEGBQ",
  "RWSCULSU",
  "OYGZHDZT",
  "GIONIZYU",
  "LHFVBXVA",
  "QWIUAVBJ",
  "VPJMUEVE",
  "CFNBLUTK",
  "IGZLWYCQ",
  "SHNPFLSX",
  "ZLBQIYFK",
  "AKJRUFON",
  "BHIHIGZG",
  "JEAASWPE",
  "OJUXXEEH",
  "QCMKOJKG",
  "SDFIHBRP",
  "IXIVXKBW",
  "VHZJKFGI",
  "YZXWLQKD",
  "EVHALOOI",
  "KNLUUAJK",
  "QEANADMK",
  "NNQHAOGW",
  "BMZNOPDQ",
  "CEOGAVLU",
  "EITAACIP",
  "NMYFCDEL",
  "AYYKSDAG",
  "MXWXQAEP",
  "LWTQIKUM",
  "MOFCKQPD",
  "NQNGDQGT",
  "MOGXZBRI",
  "DXKHPWRR",
  "WZDNDBKQ",
  "TKWRDAWI",
  "POCKYLBU",
  "VLCLRUGO",
  "LGHMKRFV",
  "OZQHLAQB",
  "QHSMQKCW",
  "DQZCCHEQ",
  "NXQJSTSX",
  "JXLZYBJN",
  "LRCYOHVY",
  "XAJLKZYO",
  "JGWFPQBS",
  "VSUANARP",
  "NTYQCRPX",
  "BFQDXMNE",
  "AVAFGWQY",
  "ZNGKRLKH",
  "KKLACHSH",
  "QEVUFYXD",
  "KLYSBIQG",
  "ZAEVJDSF",
  "OCRCPDVF",
  "PXKLPWYS",
  "OMQACFAV",
  "VDCGYVPQ",
  "OZSFIHIE",
  "OYODXYLT",
  "BJAMVABK",
  "ZLHRZLNE",
  "OQVZUCIX",
  "QMXPEYZX",
  "DRSFNZNR",
  "BZVVXQUM",
  "HOCXIGNE",
  "JWKLPHVF",
  "UKFIHXGP",
  "VCPRLGWL",
  "IBIOIPKQ",
  "COKMSZTH",
  "AQEVXQOB",
  "AVVOKICB",
  "HERETVTI",
  "SORUQUMH",
  "MCNZVWLO",
  "FGKFIGGI",
  "BZXJELBE",
  "SEQQIXQR",
  "VXCNQHLR",
  "DHEAUMDO",
  "QDMFMMNY",
  "ODVFXVXE",
  "DEKGUCZA",
  "VDOROYAY",
  "WFSZHBWP",
  "QHMDTYNX",
  "QLDWQHLY",
  "PHHPIAGM",
  "NVMPWRPQ",
  "QTWPEEQT",
  "OHLUVMNV",
  "YQZNVXDD",
  "EFIMFBBH",
  "CQGFDVVB",
  "ZJKPKGDE",
  "TFSNNXOL",
  "KWNLTIIC",
  "DSLFWQCV",
  "OMZWKVWF",
  "CWALAMWQ",
  "IMGZBHUE",
  "BNLKSMSI",
  "KMZWFPJC",
  "JVEGQCEM",
  "SBXWVXUJ",
  "KNFOWMSQ",
  "BWIZZTJZ",
  "CJUTKWJO",
  "LQMARROY",
  "YVLPSHTD",
  "LMSHCFLC",
  "MVOYLNXI",
  "TKPZMMDT",
  "ZGYRLRAG",
  "BLZZBRDA",
  "AVHDBBQA",
  "AMIUPEMG",
  "NASAVCTG",
  "MWDDHAQQ",
  "CNACDFVA",
  "GCVAKMZV",
  "INWTNZWK",
  "LFOEBAIO",
  "ZGJTFSCK",
  "NBTDXRGD",
  "RWPHYYEM",
  "GDODDLSI",
  "YQGIURMX",
  "GZYYTVCR",
  "DICVZKAK",
  "MSQBNHLN",
  "BGHLCMTL",
  "BVCPNSRP",
  "OPMNUCVS",
  "DMDJPEBM",
  "QJISKKJX",
  "ZYWPNIRK",
  "JZGGBCVL",
  "GPTPCCJU",
  "LJERPJET",
  "NDTZQHUC",
  "FCUNMADU",
  "RWUNSAUQ",
  "GLUKUENH",
  "ZWKYLYWB",
  "WXJHRUUX",
  "XOVMFMIF",
  "DEFDWWWU",
  "AQAHKYDE",
  "VBTNEOVE",
  "ODXDJHKU",
  "AXTCNKYE",
  "NJPYVAJH",
  "YCLDXCIG",
  "CCFNYSXZ",
  "TDJBMMBM",
  "ABEHAWFM",
  "DPFNPQDS",
  "EIBMDBLU",
  "UDBPZJFP",
  "XMXFDZRG",
  "FGKSDSYV",
  "UOAFTTZJ",
  "MDUSSGWO",
  "CUJDUIDD",
  "XRWMQMGS",
  "KGZTDUTQ",
  "DFIWYXQD",
  "KLZATSQZ",
  "GGMRCCDK",
  "TCDEMEXZ",
  "PNGNODTA",
  "EDZXQISP",
  "MSPKAJXK",
  "EYTHALCG",
  "ZLXJMIQX",
  "BPZDXGRG",
  "EMLSSPFN",
  "KXPWLSBZ",
];

function SuccessPage({ slug }: { slug: string }) {
  let [email, setEmail] = useState<string>("");
  let [message, setText] = useState<string>("");
  let [completeName, setName] = useState<string>("");
  let [err, setErr] = useState<number>(-1);

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetch("https://api.campai.com/formSubmissions/6536c50d26e1924cfba8d412", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        formData: { name: completeName, erklaerung: message, wunsch: "" + slug, mail: email },
        confirmationMail: email
      }),
    })
      .then((res) => {
        if (!res.ok) {
            throw new Error("Status not ok.");
        }
        return res.json();
      })
      .then((_) => {
        setEmail("");
        setText("");
        setErr(0);
      })
      .catch(_ => {
        setEmail("");
        setText("");
        setErr(1);
      });
  };

  return (
    <div className="container max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32 p-8">
      <h2 className="mb-16 text-3xl font-bold text-center">
        Deine Wunsch-ID ist{" "}
        <u className="text-primary dark:text-primary-400 no-underline">
          {slug}
        </u>
      </h2>

      <p className="mb-2 text-1xl text-center font-bold mt-8">
        Herzlichen Dank für deine Mithilfe in unserer gemeinsamen
        Weihnachtsaktion! Bitte fülle die untenstehenden Felder aus.
      </p>
      <form className={err == -1 ? "" : "hidden"}>
      <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Dein Name
          </label>
          <input
            type="text"
            id="name"
            onChange={(t) => setName(t.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Niko Laus"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Deine E-Mail
          </label>
          <input
            type="email"
            id="email"
            onChange={(t) => setEmail(t.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="christkind@nordpol.de"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Deine Nachricht an uns.
          </label>
          <textarea
            id="text"
            onChange={(t) => setText(t.target.value)}
            className="h-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          onClick={(e) => handleSubmit(e)}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Abschicken
        </button>
      </form>
      {err == 0 && (
        <div
          className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Nur noch ein Schritt...</p>
              <p className="text-sm">
                Vielen Dank für deine Mithilfe! Du solltest eine E-Mail erhalten
                haben, die Du bestätigen musst. Bitte überprüfe auch deinen
                SPAM-Ordner.
              </p>
            </div>
          </div>
        </div>
      )}
      {err == 1 && (
        <div
          className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
          role="alert"
        >
          <p className="font-bold">Ups...</p>
          <p>
            Leider konnten wir deinen Antrag nicht bearbeiten, versuche es
            später nochmal.
          </p>
        </div>
      )}
    </div>
  );
}

const ChristkindPage = () => {
  let [text, setText] = useState<string>("");
  const params = new URLSearchParams(location.search);
  const wishId = params.get("id");
  const valid = wishId && valid_ids.indexOf(wishId) > -1;
  return !valid ? (
    <div className="container text-center max-w-6xl mx-auto space-y-6 sm:space-y-12 mb-8 mt-32">
      <span className="mb-8 text-3xl font-bold text-center mr-4">
        Gib deine Wunsch-ID ein{" "}
      </span>
      <span className="inline-block w-full p-8 xl:w-1/4 xl:p-1">
        <form onSubmit={(e) => e.preventDefault()}>
          <label
            htmlFor="search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Suchen
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="w-4 h-4 text-gray-500 dark:text-gray-400 bi bi-postcard-heart"
                viewBox="0 0 16 16"
              >
                <path d="M8 4.5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7Zm3.5.878c1.482-1.42 4.795 1.392 0 4.622-4.795-3.23-1.482-6.043 0-4.622ZM2.5 5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Z" />
                <path
                  fillRule="evenodd"
                  d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="search"
              onChange={(t) => setText(t.target.value.toUpperCase())}
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-300 focus:border-orange-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder="ABCDEFGH"
              required
            />
            <Link
              to={`/christkind?id=${text}`}
              className="text-white absolute right-2.5 bottom-2.5 bg-primary hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
            >
              Wunsch erfüllen
            </Link>
          </div>
        </form>
      </span>
      {wishId && (
        <div
          className="w-full flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Die Wunsch-ID '{wishId}'</span> ist
            leider ungültig.
          </div>
        </div>
      )}
    </div>
  ) : (
    <SuccessPage slug={wishId?.toString()} />
  );
};

export default ChristkindPage;
