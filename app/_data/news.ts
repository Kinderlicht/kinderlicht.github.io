export type NewsItem = {
  slug: string;
  date: Date;
  heading: string;
  short: string;
  content: string;
  image: string;
  author: string;
  keywords: string[];
};

export const articleIsNew = 1000 * 60 * 60 * 24 * 7;

export const news_data: NewsItem[] = [
  {
    heading: "Wie alles begann...",
    date: new Date("2018-10-28"),
    content:
      'Im Jahr 2013 hatte Enrico Koch (damals 16 Jahre alt) begonnen, das in Wallersdorf bereits bekannte, von der Familie Schindler ins Leben gerufene Projekt „Lichterhaus“ fortzuführen. Hierfür schmückte das Haus seiner Eltern mit Tausenden von LED-Lämpchen (2013 ca. 5.000 LEDs, 2017 ca. 35.000 LEDs). Neben dem Verkauf von weihnachtsmarkttypischen Schmankerln, wie Kinderpunsch, Glühwein und Bratwurstsemmeln, konnte man einem täglich wechselnden Live-Musikprogramm lauschen. Dies lockte jährlich immer mehr Besucher an.<br><br>Der Reinerlös des Verkaufs sowie zusätzliche Spenden wurden im Anschluss an die Kinderkrebshilfe Dingolfing-Landau-Landshut e. V. übergeben.<br><br>Dabei lässt sich der Zuspruch des Projektes neben jährlich wachsenden Zuschauerzahlen auch an den wachsenden Spendenzahlen erkennen. Waren es 2013 lediglich 320,00 EUR, die gespendet werden konnten, übergab Enrico im Jahr 2017 bereits 6.098 EUR an Frau Ulrike Eckhart, die Vorsitzende des Kinderkrebshilfe Vereins. Insgesamt erwirtschaftete das Lichterhaus innerhalb von fünf Jahren Spendenbeträge im Wert von über 16.000 EUR.<br><br>2017 hieß es dann leider „Licht aus“ für die weihnachtliche Wohltätigkeitsaktion. Aus privaten Gründen war eine Fortführung des Projektes in diesem Ausmaß nicht weiter möglich.<br><br>Doch uns war sofort klar, dass wir künftig nicht einfach „Nix“ tun können. Die Idee des Vereins war geboren! Und so setzen wir uns auch weiterhin tatkräftig für die Unterstützung von Kindern mit Benachteiligung ein. Was hierzu als nächstes geplant wird, siehst Du <a href="/events">hier <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"inline-block bi bi-box-arrow-up-right\" viewBox=\"0 0 16 16\"><path fill-rule=\"evenodd\" d=\"M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z\"/><path fill-rule=\"evenodd\" d=\"M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z\"/></svg></a>.<br><br>Am 28. Oktober 2018 fanden sich dann sieben Gründungsmitglieder zusammen und gründeten den Kinderlicht Wallersdorf e. V.',
    short: "Das Lichterhaus in Wallersdorf",
    author: "Enrico Koch",
    image: "/news/wie-alles-begann.jpg",
    slug: "wie-alles-begann",
    keywords: [
      "Lichterhaus",
      "Wallersdorf",
      "Weihnachten",
      "Kinder",
      "Entlastung",
      "Spenden",
    ],
  },
  {
    heading:
      "Auf ihn mit Gebr\u00fcll - Denn auch Helden brauchen manchmal Hilfe!",
    date: new Date("2019-08-28"),
    content:
      'Wallersdorf, 28.08.2019. Unter dem Motto "Schnitzeljagd mit Asterix und Obelix" hat der Kinderlicht e. V. unter Organisation von Vorsitzenden Christina Weig alle neugierigen Kinder zum Wallersdorfer Ferienprogramm auf das Schulgel\u00e4nde der Grund- und Mittelschule eingeladen. Dieser Einladung folgten 18 interessierte und aufgeweckte Kinder der Klassenstufen 1-4, um gemeinsam mit den bekannten Kindheitshelden einen spannenden Vormittag erleben zu k\u00f6nnen.<br><br>Man versammelte sich\u00a0auf der\u00a0Busschleifen-Insel, welche\u00a0Fortan als Gallier-Lager diente und mit Decken, Getr\u00e4nken und kleinen Snacks ausgestattet war. Nach einem kurzen Kennenlernen wurde die Spannung gro\u00df, als\u00a0unerwartet Miraculix (Enrico Koch)\u00a0aus den verzauberten W\u00e4lder lief. "Hilfe, Hilfe - Sie sind weg, sie sind einfach weg" hie\u00df es dabei \u00e4ngstlich. Und Miraculix erkl\u00e4rte, dass die bekannten Helden Asterix und Obelix, welche den Druiden beim Mistelschneiden begleitet haben, von den Erzfeinden der Gallier, den R\u00f6mern (Manuel Grill & Matthias Kettl), entf\u00fchrt wurden. "Kein Problem, dann gib uns einfach von deinem Zaubertrank und wir holen die Beiden zur\u00fcck" meinte\u00a0eine Gallierin. Doch wie sich herausstellte waren nicht mehr gen\u00fcgend Zutaten zum Brauen vorhanden, sodass Miraculix und die Gallier auf die Hilfe der Kinder angewiesen war.<br><br>Um sich von Freund und Feind unterscheiden zu k\u00f6nnen, spendete der Verein T-Shirts, welche die Kinder mit eigenen Mustern und Namen verzieren konnten. Noch kurz in drei Erkundungsteams aufgeteilt und schon ging es los. Auf der Suche nach den geheimen Zutaten mussten Fallen \u00fcberwunden und R\u00e4tsel gel\u00f6st werden. Ob mit verbundenen Augen Sternenbilder f\u00fcr G\u00f6tter nachstellen, ein Netz ohne Ber\u00fchrung zu durchqueren oder eine Zauberbox mit einem Lasso zu erreichen - die Hindernisse mussten gemeinsam und durchdacht \u00fcberwunden werden.<br><br>Die Gruppen und die erfahrenen Alten (Gruppenf\u00fchrer - Nicole Christlmeier, Anna-Lena Jungbauer, Bettina Lohm\u00fcller, Alexander Rottenw\u00f6hrer und Katharina Mieslinger) kehrten mit allen Zutaten und einem gefangenen R\u00f6mer zur\u00fcck ins Camp. Dieser wurde verh\u00f6rt und nach dem R\u00f6merversteck ausgefragt. Gemeinsam mit Miraculix wurde sodann der geheime Zaubertrank gebraut und jedes Kind durfte einen gro\u00dfen Schluck davon probieren. Mit gest\u00e4rkten Kr\u00e4ften hie\u00df es dann "auf sie mit Gebr\u00fcll" und die Armee kleiner Gallier st\u00fcrmte das R\u00f6merlager.<br><br>Asterix und Obelix (Franziska Bachmeier & Sandra Schulhauser) konnten erfolgreich gerettet und ins Camp zur\u00fcckgebracht werden. Dort wurde anschlie\u00dfend, wie in den bekannten Filmen, gemeinsam gegrillt, kr\u00e4ftig gefeiert und gelacht. Ob Troubadix wohl immer noch am Baum h\u00e4ngt?!? - Vielleicht wartet ja schon bald das n\u00e4chste Abenteuer auf die tapferen Gallier!<br><br>Enrico Koch',
    short: "Asterix und Obelix in Gefahr!",
    author: "Kinderlicht",
    image:
      "/news/auf-ihn-mit-gebruell-denn-auch-helden-brauchen-manchmal-hilfe.jpg",
    slug: "auf-ihn-mit-gebruell-denn-auch-helden-brauchen-manchmal-hilfe",
    keywords: [
      "Ferienprogramm",
      "Wallersdorf",
      "Kinder",
      "Spass",
      "Entlastung",
    ],
  },
  {
    heading: "Schirmherrschaft",
    date: new Date("2019-05-03"),
    content:
      "Mit der Gr\u00fcndung unseres Vereins haben wir auch die \u00f6rtlichen Medien auf uns aufmerksam gemacht und durften das ein oder andere Interview geben. Auf die Frage, was wir uns denn f\u00fcr die Zukunft w\u00fcnschen, hat Enrico Koch mit einem Schmunzeln gemeint \u201cEin Schirmherr wad ned schlecht\u201d. Wobei aus dieser spontanen, humorvollen Aussage schlussendlich die Schlagzeile eines Berichts wurde - \u201cKinderlicht sucht Helfer und Schirmherrn\u201d.<br><br>Nur wenige Stunden nach Auslieferung der besagten Zeitung bekam Enrico Koch einen Telefon-Anruf: Florian Pronold, Bundestagsabgeordneter und Parlamentarischer Staatssekret\u00e4r, bot an, die Schirmherrschaft zu \u00fcbernehmen. \u201cWeil es mich beeindruckt, dass junge Leute einen Verein gr\u00fcnden, der da ansetzt, wo klassische Strukturen nicht mehr helfen k\u00f6nnen und weil ich die Idee witzig fand, eine Schirmherrschaft \u00fcber die Zeitung zu suchen.\u201d, begr\u00fcndete Florian Pronold uns seine Unterst\u00fctzung.<br><br>\u201cIch habe selbst in meinem Bekanntenkreis erlebt, wie einschneidend die schwere Krankheit eines kleinen Kindes f\u00fcr eine Familie sein kann.\u201d erkl\u00e4rte er uns. Die psychische Belastung f\u00fcr Betroffene sei enorm. Hinzu komme, dass trotz Gesundheitssystem oftmals die vorhandenen Strukturen nicht ausreichen \u2013 insbesondere, wenn einem Kranken mal ein Wunsch erf\u00fcllt werden soll. \u201c Dass sich junge Leute hier einsetzten und einen Verein gr\u00fcnden, finde ich beeindruckend\u201d, lobte er uns und versprach seine Unterst\u00fctzung: \u201cIch stelle bei Bedarf gerne mein Wissen zur Verf\u00fcgung und mache Werbung f\u00fcr euch!\u201d<br><br>Wir w\u00e4ren sehr beeindruckt von dem amtierenden Parlamentarischem Staatssekret\u00e4r und SPD-Vorsitzendem des Wahlkreises Rottal-Inn, sodass wir nach Absprache mit unserer Vorstandschaft und unseren Mitgliedern uns dazu entschlossen haben, die Schirmherrschaft zu besiegeln.<br><br>Dabei haben wir uns klar definiert und erkl\u00e4rt, dass die Schirmherrschaft nicht aufgrund von eventuellen Gemeinsamkeiten zwischen unserem Verein und der SPD entsteht, sondern dadurch, dass sich ein regionaler Politiker bzw. eine Person der \u00d6ffentlichkeit f\u00fcr das Engagement unseres Vereins interessiert und uns mit seiner Funktion bzw. Bekanntheit und der verbundenen \u00d6ffentlichkeitsarbeit dementsprechend f\u00f6rdert und f\u00f6rdern m\u00f6chte.<br><br>Diese Position bzw. Unterst\u00fctzungsm\u00f6glichkeit wurde durch unseren Aufruf in besagtem Zeitungsartikel jeder Person im Landkreis, und dar\u00fcber hinaus, in Form einer Schirmherrschaft bereiterkl\u00e4rt und wird nat\u00fcrlich auch weiterhin angeboten. Wir sind \u00fcber jede Form der Unterst\u00fctzung dankbar. Bislang haben wir keine weiteren Interessenten erreichen k\u00f6nnen.<br><br>Sicherlich h\u00e4tten wir bekannte Pers\u00f6nlichkeiten anfragen und animieren k\u00f6nnen, allerdings ist es nicht in unserem Interesse Leute zwanghaft von uns zu \u00fcberzeugen. Ebenfalls wollen wir uns keiner Personengruppe / Partei / Organisation oder \u00c4hnlichem verschreiben. Wir m\u00f6chten, dass interessierte Personen am Kinderlicht e. V. Gefallen finden und sich freiwillig anschlie\u00dfen.<br><br>Mit Florian Pronold an unserer Seite haben wir genau eine solche Person gefunden. Er versicherte uns seine ununterbrochene Bereitschaft zur Unterst\u00fctzung mit seinem Wissen als Rechtsanwalt, seinem Marketing und Social-Media-Bereich, seinem Netzwerk bzw. seiner allgemeinen Bekanntheit.<br><br>Bei einem pers\u00f6nlichen Treffen zwischen Florian Pronold und unserer Vorstandschaft durften wir uns von dem k\u00fcnftigen Schirmherrn ein Bild machen. Florian Pronold ist bzgl. unseres Vereins absolut unparteiisch und l\u00e4sst Politik und daraus resultierendes Eigeninteresse au\u00dfen vor und \u00fcberraschte uns mit seinem breiten Netzwerk an Bekannten und Freunden, welche dem Verein bei k\u00fcnftigen Veranstaltungen zur Seite stehen k\u00f6nnen.<br><br>Es freut uns immer wieder, wenn wir Leute mit unseren Ideen und Projekten begeistern k\u00f6nnen und unsere Bekanntheit von Woche zu Woche w\u00e4chst. Gemeinsam k\u00f6nnen wir etwas bewirken \u2013 Weil \u201cNix\u201d wird eh scho z\u2019oft do! \u2013<br><br>Enrico Koch",
    short: "Ein prominenter spannt den Schirm auf.",
    author: "Kinderlicht",
    image: "/news/schirmherrschaft.jpg",
    slug: "schirmherrschaft",
    keywords: ["Pronold", "Schirmherrschaft", "Verein", "Gründung"],
  },
  {
    heading: "#DeinMoment - Ein Tag am N\u00fcrburgring",
    date: new Date("2019-10-29"),
    content:
      "Michael Ziegler, ein Unternehmer f\u00fcr Isolierungen aus Eichendorf, lud Familien, darunter eine aus Landau, f\u00fcr ein Wochenende ein. \u201eIch fahre in einer harten Klasse\u201c, sagt Ziegler und meint das Time Attack Racing. \u201eInsgesamt hat es nur f\u00fcr ein paar Podiumspl\u00e4tze gereicht. Im Wettbewerb f\u00fcr getunte Stra\u00dfenfahrzeuge nix Weltbewegendes\u201c, sagt der 29-j\u00e4hrige Amateur-Rennfahrer und l\u00e4chelt bescheiden. F\u00fcr die neun Jugendlichen dagegen stand die Welt kopf\u00fcber! Hautnah hinter den Kulissen sahen sie tonnenschwere Lkws beladen mit Rennautos, atmeten Benzingeruch ein, h\u00f6rten Motoren aufheulen und das absolute Highlight: Die Kids durften als Beifahrer mitfahren.<br><br>Kinderlicht e. V. mit Vorsitzenden Enrico Koch bezuschusste den Tag auf der Rennstrecke, die Verpflegung und die Unterbringung im nahe gelegenen Vier-Sterne-Hotel mit \u00fcber 3.000 Euro und VKKK deckte die Gesamtsumme die anfallenden Restkosten u. a. f\u00fcr die Anreise. Marco Tillmann, Organisator der Time Attack Rennen, sponsorte die Eintritte und Boxenbesitzer Jascha Thile stellte seine Box mitten im Fahrerlager zur Verf\u00fcgung.<br><br>In der kleinen Werkstatt direkt an der Rennstrecke bewirteten von Kinderlicht e. V. Enrico und Ronald Koch sowie Matthias Kettl die Familien mit Kaffee und Kuchen. Derweil zogen sich die Jugendlichen Sturmhauben \u00fcber und griffen nach Helmen mit dem gr\u00fcnen Kreuz, ein Symbol f\u00fcr Beifahrer. Das f\u00fcnfk\u00f6pfige Drift-Team Smoke Junkies von Michael Ziegler k\u00fcmmerte sich um ein sicheres Ein- und Aussteigen, wenn das Fahrzeug Nummer 115 mit dem Aufkleber Kinderlicht e. V., extra von einer W\u00f6rther Digitaldruckfabrik angefertigt, in die Box sauste. Die Fahrzeuge f\u00fcr Time Attack m\u00fcssen leicht sein und es gilt: weniger Gewicht \u2013 mehr Geschwindigkeit. Weil Michael Ziegler wegen drei Kilogramm Gewicht den Beifahrersitz nicht ausbaute, hatten die Kids die M\u00f6glichkeit, mitzufahren. Es dauerte nicht lange und das ungew\u00f6hnliche Outfit des BMW E36 zog die Aufmerksamkeit anderer Rennfahrer auf sich. Bereits nach den ersten Runden lenkten weitere Fahrer ihre PS-Bomber in die Box und boten sich als Taxi \u00fcber die Rennstrecke an. \u00dcberw\u00e4ltigt von der Hilfsbereitschaft h\u00e4ngte man eine gelbe Schutzweste an den Streckenposten und diese signalisierte den Rennfahrern, hier sind die, die mitfahren wollen.<br><br>Ein paar Stunden dachte Tom (Name ge\u00e4ndert) nicht an seinen Tumor. Vor einem dreiviertel Jahr hatte der junge Mann einen epileptischen Anfall und kehrte nach dem Klinikaufenthalt mit der Diagnose inoperabler Tumor im Kopf nach Hause. Das Abitur in der Tasche studiert er mittlerweile und l\u00e4sst sich von nichts unterkriegen. Ungebremst in seiner Freude war Jakob (Name ge\u00e4ndert), ein beherzter und mutiger Junge mit Down Syndrom. Sichtlich \u00fcberrascht waren die Organisatoren auch von Maria (Name ge\u00e4ndert): \u201eBei jeder Frage, ob die Geschwindigkeit in Ordnung ist, zeigte die junge Wilde die Daumen nach oben. Schneller!\u201c An diesem Wochenende konnten die Beteiligten mit teils furchtbaren Diagnosen ihre Sorgen und Lasten vergessen und die sonst unter Anspannung stehenden Familien und Angeh\u00f6rigen mussten nicht \u00fcber die schweren Folgen nachdenken, sondern l\u00e4chelten wie die Kinder vom rechten bis zum linken Ohr.<br><br>Im Laufe des freien Trainings steuerten schlie\u00dflich acht zus\u00e4tzliche Rennfahrer die Box an und so sprangen letztendlich auch Fahrten f\u00fcr die Eltern heraus. \u201eMich schimpft sie, wenn ich 140 km/h auf der Autobahn fahre\u201c, emp\u00f6rte sich ein Vater spa\u00dfeshalber, als seine Frau mit knapp 300 Sachen \u00fcber die Strecke fetzte. Vor Ort hatte ein Youtuber die Fahrzeuge mit Innenkameras ausgestattet. Es werden vor allem die Fotos und Videos vom Beschleunigen und den weit aufgerissenen Augen sein, die sich alle immer wieder gerne ansehen werden. Film- und Fotomaterial d\u00fcrfen die Familien behalten.<br><br>\u201eDie Familien nehmen das Leben anders wahr. Sie sind zufriedener und genie\u00dfen den Moment. Ihre ehrliche Freude hat man gemerkt\u201c, Enrico Koch zieht ein durch und durch positives Fazit. Er und seine Mitorganisatoren drehten keine Runde auf der Rennbahn: \u201eDie Kinder und Eltern waren derma\u00dfen mitgerissen und begeistert, da haben wir gerne verzichtet.\u201c F\u00fcr Michael Ziegler war es die zweite Aktion dieser Art und gewiss nicht die letzte. Bei dem Rennen am Nachmittag landete der Eichendorfer aus einem Starterfeld von 160 Fahren auf dem sechsten Platz. Die Familien hatten zu der Zeit bereits die sechsst\u00fcndige Heimreise mit dem Bus angetreten.<br><br>Kinderlicht e. V. wird am Freitag, 29. November, mit einem Stand auf dem Nikolausmarkt der Pfarrei vertreten sein. Der Schneeball 2.0 findet am Freitag, 27. Dezember, statt. Im neuen Jahr gastieren beim \u201eKonzert der Filmmusik\u201c \u00fcber 60 Musiker am Samstag, 7. M\u00e4rz 2020, im Pfarrsaal und begeistern zwei Stunden mit den gr\u00f6\u00dften Filmhits. Der Verein will demn\u00e4chst den 86 Sch\u00fclern der Lebenshilfe einen Kinobesuch erm\u00f6glichen. Wer den gemeinn\u00fctzigen Verein Kinderlicht e. V. unterst\u00fctzen oder Impressionen zum vergangenen Rennwochenende sehen will, findet auf der Homepage www.kinderlicht-wallersdorf.de Informationen.<br><br>Damit ihr euch einen Eindruck \u00fcber das Wochenende verschaffen k\u00f6nnt, haben\u00a0 wir ein Video f\u00fcr euch anfertigen lassen:<br><br>\u201eWir sind noch immer beeindruckt vom Wochenende auf der Rennstrecke und dem Hotel und nat\u00fcrlich von unseren Begleitern (sehr, sehr nett und gro\u00dfz\u00fcgig!!!) mit dem \u00fcberaus sympathischen \u201eRennfahrer\u201c Michael. Hoffentlich sehen wir uns irgendwo und irgendwann wieder.\u201c<br><br>\u201eVielen Dank, dass wir am N\u00fcrburgring dabei sein durften. Es war ein einmaliges Erlebnis so nah an der Rennstrecke zu sein. Die Kinder waren ganz begeistert von den schnellen und teilweise bunten Autos. Das Abendessen und die Unterbringung waren super. Vielen Dank an Kinderlicht e.V., die dieses Event mit unterst\u00fctzt haben!\u201c<br><br>\u201eEin atemberaubendes Rennerlebnis \u2013 die Helfer vor Ort, Herr Ziegler, Kinderlicht und der VKKK machten das Wochenende zu einem unvergesslichen Erlebnis!\u201c<br><br>\u201eDie Rennfahrer waren supertoll - allesamt super engagiert \u2013 vielen, vielen Dank!\u201c<br><br>Enrico Koch",
    short: "Das Highspeed-Wochenende.",
    author: "Kinderlicht",
    image: "/news/deinmoment-ein-tag-am-nuerburgring.jpg",
    slug: "deinmoment-ein-tag-am-nuerburgring",
    keywords: ["Autos", "Entlastung", "Rennen", "Familie", "VKKK", "Helfen"],
  },
  {
    heading: "Kinderlicht e. V. l\u00e4dt Schule der Lebenshilfe ins Kino ein",
    date: new Date("2019-11-24"),
    content:
      "Landau/Wallersdorf. Am vergangenen Dienstag (19.11.2019) durften 90 Sch\u00fclerinnen und Sch\u00fcler der Lebenshilfe Landau das Kult-Kino (KuKi) in Landau besuchen. Der Kinderlicht e. V. aus Wallersdorf finanzierte dieses Projekt in Zusammenarbeit mit dem Kinobesitzer Edi Sch\u00f6nwald.<br><br>Die Kinder & Jugendlichen aller Klassenstufen konnten es kaum erwarten in die beiden S\u00e4le zu kommen uns sich den besten Platz zu sichern. Jeder durfte sitzen wo er wollte. Kinderlicht wollte es an nichts fehlen lassen, sodass f\u00fcr jeden Besucher eine Popcornt\u00fcte und ein Getr\u00e4nk spendiert wurden, so wie es zu einem guten Film dazu geh\u00f6rt. Voller Begeisterung verfolgten die Sch\u00fcler die aktuellen Kinofilme und bedankten sich bei den Veranstaltern. F\u00fcr viele der Sch\u00fcler war es das erste Mal, dass Sie ein Kino besuchen durften. Der besondere Alltag macht es manchen Familien leider nicht m\u00f6glich. Umso mehr freuten sich die Veranstalter und versprachen eine Wiederholung zu gegebener Zeit.<br><br>Der Kinderlicht e. V. ist am 29.11.2019 auf dem Nikolausmarkt der Pfarrgemeinde vertreten, am 27.12.2019 findet der Schneeball 2.0 statt, wof\u00fcr bereits t\u00e4glich ab 18 Uhr unter 09933/6289907 Pl\u00e4tze reserviert werden k\u00f6nnen<br><br>Nochmal herzlichen Dank f\u00fcr die gut geplante und sch\u00f6ne Kinovorstellung im Kuki Landau. Es hat allen sehr, sehr gut gefallen und f\u00fcr uns war dies ein wunderbarer Vormittag. Herzlichen Dank auch an alle Spender und Vereinsmitglieder.<br><br>Kathrin Hippmann, SoKRin (Schulleitung)<br><br>Enrico Koch",
    short: "Ein Kino für uns allein.",
    author: "Kinderlicht",
    image:
      "/news/kinderlicht-e-v-laedt-schule-der-lebenshilfe-ins-kino-ein.jpg",
    slug: "kinderlicht-e-v-laedt-schule-der-lebenshilfe-ins-kino-ein",
    keywords: ["Spass", "Helfen", "Familie", "Entlastung"],
  },
  {
    heading: "Crowdfunding-Kampagne f\u00fcr Silvester gestartet",
    date: new Date("2019-11-24"),
    content:
      "Erneut gl\u00e4nzt der Kinderlicht e. V. mit einer Veranstaltungsidee.\u00a0 Zu Silvester eine Feier veranstalten und statt auf Feuerwerk auf moderne Lichttechnik mittels einer Lasershow setzten. Doch die Kosten hierf\u00fcr sind vom Verein allein nicht zu stemmen.<br><br>Enrico Koch, 1. Vorsitzender des Vereins, erkl\u00e4rt: \u201eWir wollten schon l\u00e4nger an Silvester etwas veranstalten, doch der indirekte Zwang dann in teure Pyrotechnik zu investieren, welche f\u00fcr unsere Tiere aufgrund der Lautst\u00e4rke der absolute Horror ist & die abgefeuerten Knallk\u00f6rper, die auch oft Wochen nach den Veranstaltungen noch auf den Stra\u00dfen und in den G\u00e4rten zu finden sind, st\u00f6rte uns massiv. Wir wollten daher etwas anders, etwas neues, etwas einmaliges!\u201c<br><br>Dem Verein war klar: Auf modernste Technik setzen und eine Lasershow organisieren. Doch die Kosten f\u00fcr eine derartige Vorf\u00fchrung sind enorm und ab einem Bereich von 10.000 EUR aufw\u00e4rts einzuordnen. Nach mehreren Telefonaten konnte nun ein Anbieter aus Stuttgart gefunden werden, mit dem das Event durchgef\u00fchrt werden soll, dennoch fallen nach einem gro\u00dfz\u00fcgigen Benefizrabatt immer noch Kosten in H\u00f6he von 3.780 EUR an. Diese m\u00f6chte der Verein nun dank einer Crowdfunding-Aktion der VR-Bank Landau Mengkofen eG unter dem Motto \u201eViele schaffen mehr\u201c erreichen.<br><br>Die ben\u00f6tigten 50 Fans zur Ver\u00f6ffentlichung des Projekts wurden innerhalb von 18 Stunden erreicht, was auch die Bef\u00fcrwortung der \u00d6ffentlichkeit zeigt.<br><br>Wenn das Projekt erfolgreich finanziert werden kann, l\u00e4dt der Verein alle interessierten B\u00fcrgerinnen & B\u00fcrger am 31.12.2019 gegen 22 Uhr in den Biergarten des Br\u00e4uhofs Wallersdorf zum gemeinsamen feiern und staunen ein. Die Lasershow hat eine Dauer von 20-25 Minuten und ist mit passender Musik untermalt. F\u00fcr ausreichend Verpflegung und gem\u00fctlichen Barbetrieb wird nat\u00fcrlich gesorgt. Der Reinerl\u00f6s der Veranstaltung sowie eine evtl. \u00dcberzahlung des Projekts gehen dabei direkt an bed\u00fcrftige Kinder & Jugendliche aus der Region.<br><br>Christina Weig, ebenfalls Vorsitzende, f\u00fchrt auf: \u201eWenn jeder die obligatorischen 25-50 EUR statt f\u00fcr Feuerwerk in das Projekt steckt und anschlie\u00dfend zum Feiern vorbeikommt, ist jedem geholfen. Eine Win-Win Situation, denn Zuhause hat man den Stress und M\u00fcll los und bei uns einen unvergesslichen Start in das Jahr 2020!\u201c<br><br>Wer das Projekt unterst\u00fctzen m\u00f6chte kann bis zum 30.12.2019 noch unter https://vrbanklm.viele-schaffen-mehr.de/show-der-tausend-lichter eine Spende hinterlassen.<br><br>Spendenquittungen werden vom Verein ausgestellt. Bei Scheitern des Projekts gehen alle eingezahlten Betr\u00e4ge direkt an die Spender in voller H\u00f6he zur\u00fcck.<br><br>Enrico Koch",
    short: "Das Highlight des Jahres.",
    author: "Kinderlicht",
    image: "/news/crowdfunding-kampagne-fuer-silvester-gestartet.jpg",
    slug: "crowdfunding-kampagne-fuer-silvester-gestartet",
    keywords: [
      "Aktion",
      "Veranstaltung",
      "Laser",
      "Show",
      "Gemeinwohl",
      "Umwelt",
    ],
  },
  {
    heading: "Statt Kundengeschenke Kindern helfen",
    date: new Date("2019-12-03"),
    content:
      "Deggendorf/Wallersdorf. Erneut darf der Kinderlicht e. V. aus Wallersdorf eine Spende entgegennehmen. Die Firma Orizon (Personalvermittlung) hat die beiden Vorstände Christina Weig und Enrico Koch in die Betriebsstätte nach Deggendorf zur offiziellen Scheckübergabe in Höhe von 250,00 EUR eingeladen.<br><br>Die Personalberaterinnen Regina Bierl, Tamara Sturm, Maria Heigl, Monika Lepp, Nadine Ertl überreichten den Scheck an Kinderlicht e. V.<br<br>Christina & Enrico bedanken sich für die Spende, welche Sie direkt in künftigen Projekten zur Unterstützung benachteiligter Kinder heranziehen werden.",
    short: "Zusammen für alle.",
    author: "Kinderlicht",
    image: "/news/statt-kundengeschenke-kindern-helfen.jpg",
    slug: "statt-kundengeschenke-kindern-helfen",
    keywords: ["Spende", "Kinder", "Helfen"],
  },
  {
    heading: "Nikolausmarkt: Frischer Bratapfelauflauf war der Renner",
    date: new Date("2019-12-03"),
    content:
      "Wallersdorf. Am vergangenem ersten Advents-Freitag war es wieder soweit und der Nikolausmarkt der Pfarrgemeinde St. Johannes in Wallersdorf \u00f6ffnete die St\u00e4nde. Nach einer Woche Aufbau, Schm\u00fccken und Verzierung war der \u00f6rtliche Christkindlmarkt f\u00fcr die Besucher ab 17 Uhr er\u00f6ffnet.<br><br>Auch der Kinderlicht e. V. war unter Leitung von Christina Weig (Vorsitzende des Vereins, rechts im Bild) neu vertreten und bot herzhaften Bratapfelauflauf, Pl\u00e4tzchen, Lik\u00f6re und Gebasteltes an. Preise wurden dabei keine verlangt, jeder konnte bezahlen, was es ihm wert war.<br><br>Die Einnahmen werden dabei f\u00fcr k\u00fcnftige Projekte sowie zur Unterst\u00fctzung von benachteiligten Kindern und Jugendlichen aus der Region verwendet.<br><br>Christina Weig bedankte sich bei allen Helfern, die den Stand auf und abgebaut sowie bei den Vorbereitungen geholfen haben. Ein besonderer Dank geht dabei auch an Anna-Lena & B\u00e4rbel Jungbauer, an Manuela, Michelle & Ronald Koch, welche neben Christina mit dem Verkauf der Ware engagiert waren.<br><br>Ebenfalls bedanke Sie sich bei Allen, welche tatkr\u00e4ftig Aufl\u00e4ufe gebacken und gespendet haben sowie bei Silvia Voit, f\u00fcr die Spende der Pl\u00e4tzchen und Lik\u00f6re und Antonia Sagstetter f\u00fcr die gebastelten Geschenke.",
    short: "Ein Apfel am Tag...",
    author: "Kinderlicht",
    image: "/news/nikolausmarkt-frischer-bratapfelauflauf-war-der-renner.jpg",
    slug: "nikolausmarkt-frischer-bratapfelauflauf-war-der-renner",
    keywords: [
      "Veranstaltung",
      "Nikolaus",
      "Helfen",
      "Weihnachten",
      "Advent",
      "Essen",
    ],
  },
  {
    heading: "Mit Currywurst bed\u00fcrftige Kinder unterst\u00fctzt",
    date: new Date("2019-12-03"),
    content:
      "Geiselh\u00f6ring/Wallersdorf. Meistens kommt doch alles anders, als man denkt. So vermutlich auch f\u00fcr die Gastst\u00e4ttenbetreiber Michael Jann und Elisabeta Florea des Tennis Ass in Geiselh\u00f6ring.<br><br>In Zeiten, in denen soziale Netzwerke allt\u00e4glich sind, finden auch online Bewertungen zu Restaurants und Gastst\u00e4tten immer mehr Aufmerksamkeit. Auch das Tennis Ass ist hiervon nicht verschont worden, sodass eine schlechte Bewertung bzgl. der angebotenen Currywurst auf der Internetseite des Restaurants hinterlassen wurde. Solch eine Bemerkung kann dabei auch gleich falsch verstanden werden oder zu endlosen Diskussionen zwischen Gast und Koch f\u00fchren, doch Michael Jann machte dies anders.<br><br>Er nutzte die Gelegenheit den G\u00e4sten zu zeigen, wo seine Kochk\u00fcnste liegen und veranstalte schnell am 28.11.2019 ein Currywurst-Essen. Er versprach feinste Metzgercurrywurst mit knackigen Pommes und hausgemachter Curryso\u00dfe sowie gratis Majo. Als Nachspeise servierte er Vanillekipferl und das alles zu einem Unkostenpreis von unschlagbaren 2,50 EUR.<br><br>Susanne Unger, Wallersdorferin und Mitglied des Kinderlicht e. V., hatte von der Aktion geh\u00f6rt und sofort mit dem Wirt Kontakt aufgenommen. \u201eWarum nicht die Leute zahlen lassen was es ihrer Meinung nach wert war und den \u00dcberschuss an eine gemeinn\u00fctzige Organisation, z. B. Kinderlicht, spenden?\u201c fragte Sie. Gesagt getan. Die Werbetrommel wurde noch einmal ordentlich ger\u00fchrt und viele G\u00e4ste besuchten das Wirtspaar, sodass am Ende eine beachtliche Spendensumme in H\u00f6he von 333,00 EUR erwirtschaftet wurde.<br><br>Susanne Unger, nat\u00fcrlich selbst beim Currywurstessen vor Ort, nahm im Namen des Vereins die Spendensumme entgegen und \u00fcberreichte Sie an Christina Weig, zweite Vorsitzende von Kinderlicht, welche sich bei Susanne f\u00fcr das ausgebrachte Engagement und die Unterst\u00fctzung durch die Wirtsleute bedankte.",
    short: "Der Ruf der Currywurst.",
    author: "Kinderlicht",
    image: "/news/mit-currywurst-beduerftige-kinder-unterstuetzt.jpg",
    slug: "mit-currywurst-beduerftige-kinder-unterstuetzt",
    keywords: ["Spende", "Essen", "Helfen", "Sport"],
  },
  {
    heading: "Tanzen f\u00fcr den guten Zweck",
    date: new Date("2019-12-27"),
    content:
      "Wallersdorf. Bereits zum zweiten Mal konnten sich tanzbegeisterte Besucher auf einen weiteren Ball in Wallersdorf freuen. Der Verein Kinderlicht knüpfte an den bereits 2018 abgehaltenen Ball an und lud am 28.12.2019 die Bevölkerung für unbeschwerte Stunden in den Pfarrsaal ein.<br><br>Bereits beim Betreten des Saals konnte man die Steigerungen zum Vorjahr erkennen. Zahlreiche Lichter schmückten den Saal, die Tanzfläche wurde von einer “Lichterdecke” geziert, selbst gebastelte winterliche Dekoration fand man über der Bühne und auf den Tischen wieder.<br><br>Auch Nicole Christlmaier (Klavier) und Melanie Rose (Gesang) sorgten wieder für angenehme Atmosphäre von Einlass bis Beginn des Abends.<br><br>Die Vorsitzenden Enrico Koch und Christina Weig eröffneten den Ball mit einer Einlage. “Wo bleibst denn scho wieder – mia verpass ma no unsern eigenen Ball!” hört man Enrico schreien. “Kimm ja scho, hetz mi ned!” eilt Christina hinterher und beide verschwinden hinter der Bühne. Ein “ausversehen” noch angeschaltetes Mikrofon ließ die Zuschauer mithören, worüber man sich sonst eben nur im Hinterzimmer unterhält.<br><br>Für prächtige Stimmung und eine stets gefüllte Tanzfläche sorgte auch 2019 die Band “TRIXX”, welche einen Benefizauftritt abhielt zur Unterstützung des Vereins. Auch das familiäre Küchenteam und die professionellen Bedienungen spendeten den Arbeitseinsatz ganz dem Kinderlicht e. V.<br><br>Der Verein bedankte sich bei allen Helfern und Unterstützern und hofft auch im kommenden Jahr einen Ball veranstalten zu können.<br><br>Feedback der Besucher:<br><br>\u201cDer Schneeball vom Kinderlicht e. V. entwickelt sich innerhalb k\u00fcrzester Zeit zum wohl sch\u00f6nsten Ball in Wallersdorf und dar\u00fcber hinaus!\u201d<br><br>\u201cWir kommen jedes Jahr gerne & w\u00fcrden am liebsten gleich f\u00fcr 2020 reservieren. Man sp\u00fcrt mit wie viel Herzblut das Team den Ball organisiert.\u201d<br><br>\u201cEs ist unglaublich, was der Kinderlicht e. V. jedes Jahr aus dem Pfarrsaal macht \u2013 die Band ist gigantisch und man m\u00f6chte gar nicht aufh\u00f6ren zu tanzen!\u201d",
    short: "Einfach mal das Tanzbein schwingen.",
    author: "Kinderlicht",
    image: "/news/schneeball.JPG",
    slug: "tanzen-fuer-den-guten-zweck",
    keywords: [
      "Ball",
      "Veranstaltung",
      "Gemeinwohl",
      "Schnee",
      "Winter",
      "Weihnachten",
    ],
  },
  {
    heading: "Lasershow-Premiere in Wallersdorf",
    date: new Date("2020-01-01"),
    content:
      "Ein solches Spektakel hat es in Wallersdorf auch noch nicht gegeben \u2013 statt Feuerwerk war an Silvester eine gro\u00dfe Lasershow auf dem Biergartengel\u00e4nde des Br\u00e4uhofs Wallersdorf zu sehen.<br><br>Sch\u00e4tzungsweise \u00fcber 600 Zuschauer aus allen Ortsteilen fanden den Weg zur Show \u2013 der Eintritt war frei.<br><br>Schon weit vor Mitternacht konnten die Besucher am Gel\u00e4nde ankommen, alte Bekannte wieder treffen und gemeinsam eine sch\u00f6ne Zeit verleben. Die aufgestellten Heizpilze sorgten f\u00fcr eine angenehme Temperatur.<br><br>Wer wollte, konnte sich an der Bar mit Mischgetr\u00e4nken oder Sekt zum Ansto\u00dfen versorgen.<br><br>Um 00:00 Uhr war es dann soweit \u2013 Markus Zapula, seines Zeichens Lasershowk\u00fcnstler \u2013 begr\u00fc\u00dfte die Zuschauer und sch\u00fcrte Vorfreude f\u00fcr die n\u00e4chsten Minuten. Untermalt mit Musik begann die Show. Etwa eine halbe Stunde lang peitschten bunte Lichter durch die Menschenmenge und begeisterten Jung wie Alt.<br><br>Danach wurde noch munter weitergefeiert, bis der Abend schlussendlich ausklang.<br><br>Finanziert wurde die Show im Vorfeld durch das Crowdfunding der VR Bank \u2013 jeder gespendete Euro wurde verdoppelt bis die Spendensumme erreicht war. Damit war es m\u00f6glich, dass wir den Reinerl\u00f6s spenden konnten. Die Einnahmen kommen einem eingeschr\u00e4nkten Jugendlichen aus Wallersdorf zugute.",
    short: "Ein leiser Silvester-Knall.",
    author: "Kinderlicht",
    image: "/news/lasershow-premiere-in-wallersdorf.jpg",
    slug: "lasershow-premiere-in-wallersdorf",
    keywords: [
      "Silvester",
      "Umwelt",
      "Veranstaltung",
      "Highlight",
      "Feuerwerk",
    ],
  },
  {
    heading: "Einen Beitrag zum Auto geleistet",
    date: new Date("2020-05-28"),
    content:
      "Haidlfing. Unter anderem \u00fcber Facebook hatte Ramona L\u00fcck um Hilfe gebeten. Die Tochter Lisa-Marie ist schwerst behindert, die \u00c4rzte weit entfernt, die Schule in Regensburg und das Auto ist reparaturbed\u00fcrftig.<br><br>So hat der Hilferuf auch uns erreicht und wir haben der Familie L\u00fcck mit einer Spende von 2.000\u20ac etwas unter die Arme gegriffen.<br><br>Mittlerweile ist durch die sagenhafte Unterst\u00fctzung verschiedener Organisationen die Spendensumme f\u00fcr das Auto zusammengekommen. F\u00fcr die kleine Lisa-Marie, die sehr gerne Auto f\u00e4hrt, freut uns das nat\u00fcrlich besonders.<br><br>Wir w\u00fcnschen der Familie alles Gute und Lisa viel Spa\u00df beim Autofahren!",
    short: "Ein Auto für die ganze Familie.",
    author: "Kinderlicht",
    image: "/news/einen-beitrag-zum-auto-geleistet.jpg",
    slug: "einen-beitrag-zum-auto-geleistet",
    keywords: ["Helfen", "Kinder", "Spenden", "Gemeinwohl", "Auto", "Zusammen"],
  },
  {
    heading: "Eine musikalische Reise durch die Welt der Filmmusik",
    date: new Date("2020-03-07"),
    content:
      "Wallersdorf. F\u00fcr Musikliebhaber, die gleichzeitig noch gerne Filme schauen war es ein Gaumenschmaus \u2013 80 Musikerinnen und Musiker entf\u00fchrten die Zuh\u00f6rer auf eine Reise durch die Welt der Filmmusik.<br><br>Doch auch wer einfach nur gute Musik mochte, war an der richtigen Adresse.<br><br>F\u00fcr jeden Geschmack war etwas dabei \u2013 ob aus Disney Klassikern, Bohemian Rhapsody, Narnia, Harry Potter, Tribute von Panem oder auch aus eher unbekannten Filmen \u2013 die St\u00fccke kamen von \u00fcberall her.<br><br>So bunt wie der Mix der Musik war auch der Mix der Musiker selbst \u2013 von Solisten, Duetten und Quartetten angefangen beteiligten sich der Kirchenchor Wallersdorf, der Orchesterverein Dingolfing-Landau, der Chor Funny Friday aus Landau, ein Chor aus Sch\u00fclern der Berufsfachschule f\u00fcr Musik Plattling und die Bigband der BfS Plattling am Konzert. Sie alle sorgten f\u00fcr einen rundum gelungenen Abend und f\u00fcr grandiose Stimmung.<br><br>Mal fr\u00f6hlich und spritzig, mal schwer und melancholisch, mal herzerweichend sch\u00f6n oder auch triumphal und episch \u2013 der Abend bot ein rundes Programm f\u00fcr die Besucher.<br><br>Unser Dank gilt allen, die diesen Abend m\u00f6glich gemacht haben. Ganz besonders allen Musikerinnen und Musikern, die uns alle mit ihren Vorstellungen verzaubert haben.",
    short: "Konzert der Filmmusik.",
    author: "Kinderlicht",
    image: "/news/eine-musikalische-reise-durch-die-welt-der-filmmusik.jpg",
    slug: "eine-musikalische-reise-durch-die-welt-der-filmmusik",
    keywords: [
      "Musik",
      "Veranstaltung",
      "Gemeinwohl",
      "Konzert",
      "Kunst",
      "Kultur",
    ],
  },
  {
    heading: "Ein St\u00fcck Lebensfreude gestiftet",
    date: new Date("2020-06-05"),
    content:
      "Wallersdorf. Tief bewegt hat uns das Schicksal von Dominik, auf das wir vergangenes Jahr aufmerksam wurden. Der 24-j\u00e4hrige leidet an einer schweren Muskeldystrophie. Mit 4 Jahren wurde diese das erste Mal diagnostiziert, seit er 10 Jahre alt ist sitzt Dominik im Rollstuhl. Mit einem kleinen Ball bei seinen Fingern bewegt er diesen und hat sich so noch ein wenig Mobilit\u00e4t erhalten.<br><br>Wir wollen der Familie etwas Beistand leisten und haben so die Einnahmen der Lasershow und etwas mehr f\u00fcr Dominik reserviert.<br><br>Auch die Aktion \u201eFreude durch Helfen\u201c vom Straubinger Tagblatt ist auf Dominik aufmerksam geworden und wir durften hier als Pate fungieren. So konnten wir und \u201eFreude durch Helfen\u201c jeweils 3.000\u20ac an Dominik \u00fcberreichen.<br><br>Dominiks Zimmer ben\u00f6tigt dringend einige neue M\u00f6bel, die speziell an ihn angepasst sind und wenn danach noch etwas f\u00fcr Marvel- oder Star Wars Filme f\u00fcr Dominik \u00fcbrig bleibt ist uns das als treuen Marvel-Fans nur recht.<br><br>Wir w\u00fcnschen Dominik und seiner Familie von Herzen alles Gute, viel Spa\u00df beim Filme schauen und trotz allem Freude am Leben!",
    short: "Die Welt erleben.",
    author: "Kinderlicht",
    image: "/news/ein-stueck-lebensfreude-gestiftet.jpg",
    slug: "ein-stueck-lebensfreude-gestiftet",
    keywords: ["Helfen", "Spenden", "Jugendlich"],
  },
  {
    heading: "JHV 2020",
    date: new Date("2020-07-11"),
    content:
      "Wallersdorf. Am 05.07.2020 lud der Kinderlicht Wallersdorf e. V. alle Mitglieder und Nicht-Mitglieder zur Jahreshauptversammlung ein. Die beiden amtierenden Vorst\u00e4nde Enrico Koch und Christina Weig begr\u00fc\u00dften die Anwesenden und freuten sich \u00fcber den zahlreichen Besuch.<br><br>Zu Beginn standen einige Satzungs\u00e4nderungen an. Nach nunmehr eineinhalb Jahren Bestehen habe man einige Verbesserungsm\u00f6glichkeiten entdeckt, die einer Satzungs\u00e4nderung bed\u00fcrfen. So wurde beispielsweise der Vereinszweck nicht nur auf die Unterst\u00fctzung von Kindern sondern auf die Unterst\u00fctzung von Jugendlichen und Jungen Erwachsenen erweitert. Ebenso wurde die Vorstandschaft um einen Schriftf\u00fchrer und einen Beisitzer erweitert. Die neue Vorstandschaft wurde gew\u00e4hlt. Einstimmig wurden jeweils Enrico Koch zum ersten Vorsitzenden, Christina Weig zur zweiten Vorsitzenden sowie Julian Dietlmeier zum Kassier, wiedergew\u00e4hlt und Matthias Kettl zum Schriftf\u00fchrer, sowie Anna-Lena Jungbauer zur Beisitzerin gew\u00e4hlt.<br><br>Julian Dietlmeier stellte anschlie\u00dfend den Kassenbericht vor. Insgesamt geht es der Vereinskasse trotz gro\u00dfer Spendensummen gut und man blickt zuversichtlich auf die kommenden Jahre. Parallel dazu teilten die beiden Vorst\u00e4nde mal am\u00fcsante, mal nachdenkliche Erinnerungen zu den abgehaltenen Veranstaltungen und Spenden\u00fcbergaben und blickten gemeinsam mit den Mitgliedern auf ein aktives Jahr 2019 und Beginn 2020 zur\u00fcck.<br><br>Vom Blick zur\u00fcck richtete man dann die Augen auf die Zukunft. Aufgrund der aktuellen Situation k\u00f6nne man zwar nicht mit Datum oder Jahr planen, jedoch wurden einige Veranstaltungen angesprochen, die man in Zukunft in den Fokus nehmen werde. Darunter der j\u00e4hrliche Schneeball, aber auch eine Neuauflage des Konzerts der Filmmusik, eventuell als Outdoorveranstaltung. Die Vorst\u00e4nde betonten auch, dass Jeder und Jede herzlich willkommen sei, seine Ideen einzubringen, unabh\u00e4ngig von deren Umsetzbarkeit. Gerade aus im ersten Moment unm\u00f6glich erscheinenden Gedanken entst\u00fcnden die besten Aktionen.<br><br>Die Vorstandschaft bedankte sich von Herzen bei allen aktiven und nicht-aktiven Mitgliedern. Diese sind das Herz des Vereins und ohne den R\u00fcckhalt und das Engagement jedes Einzelnen ginge es nicht. Als Mitglied und B\u00fcrgermeister richtete Franz Aster das Wort an die Versammelten und bedankte sich f\u00fcr die Organisation des Vereins, sowie die daraus entstehende Bereicherung f\u00fcr die Marktgemeinde Wallersdorf. Damit schlossen die Vorst\u00e4nde die Versammlung und w\u00fcnschten allen einen guten Nachhauseweg.<br><br>Bilder: V. Lengfelder",
    short: "Jahreshauptversammlung: Ein erfolgreiches Jahr.",
    author: "Kinderlicht",
    image: "/news/jhv-2020.jpg",
    slug: "jhv-2020",
    keywords: [
      "Veranstaltung",
      "JHV",
      "Jahreshauptversammlung",
      "Gemeinwohl",
      "Versammlung",
    ],
  },
  {
    heading: "Nachruf",
    date: new Date("2020-08-20"),
    content: "",
    short: "Unser herzliches Beileid.",
    author: "Kinderlicht",
    image: "/news/nachruf-1.jpg",
    slug: "nachruf-1",
    keywords: ["Nachruf", "Danke"],
  },
  {
    heading: "Spende in H\u00f6he von 510\u20ac erhalten",
    date: new Date("2020-10-29"),
    content:
      "Traditionell f\u00fchrte die Jugendgruppe Oberp\u00f6ring Anfang Januar 2020 an zwei Terminen ein einstudiertes Theaterst\u00fcck auf. Die Vorstandschaft der Jugendgruppe hatte sich im Vorfeld der Auff\u00fchrungen dazuentschlossen, eine Spendenbox aufzustellen, um Spenden f\u00fcr einen guten Zweck zu sammeln. Die Zuschauer spendeten an den beiden Tagen flei\u00dfig. Die Jugendgruppe selbst erh\u00f6hte den Betrag noch, so dass am Ende 510\u20ac zu Buche standen. Die Wahl der zu unterst\u00fctzenden Einrichtung fiel auf Kinderlicht Wallersdorf e.V. Den Vorschlag dazu hatte das Jugendgruppenmitglied Franz Borst eingebracht. Kinderlicht Wallersdorf e.V. sammelt Spendengelder f\u00fcr sozial benachteiligte, insbesondere an Krebs erkrankte Kinder. Am vergangenen Samstag, 24.10.2020, konnte nun die \u00dcbergabe der Spende an Kinderlicht Wallersdorf e.V. erfolgen. Jugendgruppenvorstand Christoph Kirschner und Franz Borst \u00fcbergaben die Spende an Vorstand Enrico Koch und Vorstandsmitglied Matthias Kettl von Kinderlicht Wallersdorf e.V. Enrico Koch bedankte sich ganz herzlich bei der Jugendgruppe Oberp\u00f6ring.",
    short: "Theater für den guten Zweck.",
    author: "Kinderlicht",
    image: "/news/spende-in-hoehe-von-510e-erhalten.jpg",
    slug: "spende-in-hoehe-von-510e-erhalten",
    keywords: ["Theater", "Spende", "Helfen", "Spass"],
  },
  {
    heading:
      "1000\u20ac Spende vom Bestattungsunternehmen D. Fischer e.K. erhalten",
    date: new Date("2020-11-14"),
    content:
      "Wallersdorf. Vom Bestattungshaus D. Fischer, war Juniorchef Pascal Lanzl vor Ort und \u00fcbergab eine Spende von 1 000 Euro an Kinderlicht. Erster Vorsitzender Enrico Koch und zweite Vorsitzende Christina Weig freuten sich sehr und bedankten sich herzlich. \u201eIn diesen schwierigen Zeiten ist es gut, wenn jemand an uns denkt\u201c. Wegen der aktuellen Lage findet heuer der \u201eSchneeball\u201c im Dezember leider nicht statt. \u201eDa brechen uns viele Spenden einfach weg\u201c. Das Bestattungshaus Fischer hat B\u00fcros in Straubing und Schwarzach, ein B\u00fcrogeb\u00e4ude in Oberp\u00f6ring befindet sich im Bau und steht ab dem Fr\u00fchjahr 2021 den Angeh\u00f6rigen zur Verf\u00fcgung. Im Trauerfall werden die notwendigen Formalit\u00e4ten erledigt, die Bestattung sowie die gesamte Organisation werden \u00fcbernommen. Schon zu Lebzeiten wird bei einer individuellen Bestattungsvorsorge beraten. Hr. Lanzl ist sicher: \u201eDa kommt das Geld hundertprozentig an die richtige Stelle\u201c.",
    short: "1000€ für den guten Zweck.",
    author: "Kinderlicht",
    image: "/news/fischer.jpg",
    slug: "spende-vom-bestattungsunternehmen-d-fischer-e-k-erhalten",
    keywords: ["Spende", "Helfen"],
  },
  {
    heading: "Nachruf",
    date: new Date("2020-12-12"),
    content: "",
    short: "Unser herzliches Beileid.",
    author: "Kinderlicht",
    image: "/news/nachruf-2.jpg",
    slug: "nachruf-2",
    keywords: ["Nachruf", "Danke"],
  },
  {
    heading: "Masken f\u00fcr ein Kinderl\u00e4cheln",
    date: new Date("2020-12-12"),
    content:
      "Das herzliche L\u00e4cheln eines anderen Menschen sehen wir zurzeit leider nicht mehr so oft wie gewohnt, die Alltagsmasken hindern uns daran. Dass diese Masken aber auch ein L\u00e4cheln schaffen k\u00f6nnen hat unser Mitglied Bettina Gabler bewiesen. Seit Beginn der Pandemie n\u00e4ht sie Masken auf Anfragen \u2013 zu Beginn nicht ganz freiwillig, wie sie selbst erz\u00e4hlt.<br><br>\u201eIch wollte mich an der Pandemie nicht bereichern\u201c, berichtet die nebenberuflich selbstst\u00e4ndige N\u00e4herin. Auf das Dr\u00e4ngen einer Freundin hin habe sie schlie\u00dflich doch nachgegeben, jedoch unter der Voraussetzung, die Einnahmen zu spenden. Das Material hat Bettina aus eigener Tasche bezahlt. Eine St\u00fctze zum Erfolg war Bettinas Mutter, \u201eohne Ihre Hilfe h\u00e4tte ich das nicht geschafft\u201c.<br><br>Aus einer Maske wurden innerhalb k\u00fcrzester Zeit viele Masken, und so \u00fcberreichte uns Bettina zuletzt einen stolzen Spendenscheck in H\u00f6he von 1 000 \u20ac. Dieses Geld wird mit Sicherheit das ein oder andere L\u00e4cheln auf die Gesichter der Kinder und ihrer Familien zaubern, die es zum Schluss erhalten werden. Uns hat es auf jeden Fall bis \u00fcber beide Ohren zum L\u00e4cheln gebracht.<br><br>Bettina hat sich vor einigen Jahren mit ihrer N\u00e4hstube \u201eFeuernadel\u201c nebenberuflich selbstst\u00e4ndig gemacht. In ihrer Wohnung in Haidlfing n\u00e4ht sie Taschen, Babykleidung und vieles mehr. Jedoch vorerst keine Masken mehr. \u201eIrgendwann wurde es zu viel und ich musste die Bremse ziehen.\u201c<br><br>Unser herzliches Dankesch\u00f6n, Bettina, die Aktion ist wirklich grandios. Wir danken dir f\u00fcr die Idee, die vielen Stunden, die du investiert hast und den Ertrag, den wir an die richtigen Stellen weiterleiten werden.",
    short: "Gutes in Krisenzeiten.",
    author: "Kinderlicht",
    image: "/news/masken.jpg",
    slug: "masken-fuer-ein-kinderlaecheln",
    keywords: ["Spende", "Danke", "Helfen", "Maske", "Corona"],
  },
  {
    heading:
      "Spenden\u00fcbergabe durch AGC INTERPANE Architectural Glass GmbH Plattling",
    date: new Date("2023-09-12"),
    content:
      "W\u00e4hrend des Sommerfestes der Firma AGC INTERPANE Architectural Glass GmbH Plattling am 23.06.2023 wurden von den Auszubildenden Aktionen zugunsten des Kinderlicht Wallersdorf e. V. organisiert. Die Mitarbeiter haben sich an diversen Gewinnspielstationen rege beteiligt und es konnte dem Kinderlicht Wallersdorf e. V.  am 06.09.2023 ein stattlicher Betrag in H\u00f6he von 1.614,00 Euro \u00fcbergeben werden. Im Rahmen der Spenden\u00fcbergabe durch die Auszubildenden der Firma und der Ausbildungsleitung, Frau R\u00f6ckl, bedankten sich Enrico Koch und Christina Weig vom Kinderlicht Wallersdorf e. V. herzlich f\u00fcr die finanzielle Unterst\u00fctzung.",
    short: "1600€ für den guten Zweck.",
    author: "Kinderlicht",
    image: "/news/SpendenuebergabeAGC.jpg",
    slug: "spendenuebergabe-durch-agc-interpane-architectural-glass-gmbh-plattling",
    keywords: ["Spende", "Danke", "Helfen"],
  },
  {
    heading: "Nachruf",
    date: new Date("2021-02-20"),
    content: "",
    short: "Unser herzliches Beileid.",
    author: "Kinderlicht",
    image: "/news/nachruf-3.jpg",
    slug: "nachruf-3",
    keywords: ["Nachruf", "Danke"],
  },
  {
    heading: "500\u20ac Spende der Kommunionkinder Haidlfing",
    date: new Date("2021-06-07"),
    content:
      "Eine ganz besondere Spende durften wir am Freitag, den 04.06.2021 entgegennehmen: die Kommunionkinder aus Haidlfing haben wie allj\u00e4hrlich in der Karwoche Osterkerzen zum Verkauf angeboten \u2013 das Geld konnte in den Opferstock gelegt werden. Dieses Jahr haben sie uns das Geld anvertraut und Familie Karg hat den Betrag auf runde 500 \u20ac aufgestockt.<br><br>Vielen herzlichen Dank daf\u00fcr! Wir w\u00fcnschen allen Kommunionkindern und ihren Familien alles Gl\u00fcck dieser Welt f\u00fcr ihren weiteren Lebensweg und Erfolg in allen, das sie anpacken!",
    short: "Kinder helfen Kinder.",
    author: "Kinderlicht",
    image: "/news/500e-spende-der-kommunionkinder-haidlfing.jpg",
    slug: "spende-der-kommunionkinder-haidlfing",
    keywords: ["Kinder", "Helfen", "Danke", "Spende", "Kirche"],
  },
  {
    heading: "3 Tage Mittelalter - Ferienprogramm 2021",
    date: new Date("2021-09-22"),
    content:
      "Wallersdorf. Drei Tage lang konnten 20 Kinder mit dem Kinderlicht Wallersdorf e. V. ins Mittelalter eintauchen. Sie gestalteten eigene Kost\u00fcme, wurden auf neue Namen getauft, spielten Ritter und Burgfr\u00e4ulein und feierten den Abschluss mit einem Mittelalterfest.<br><br>Ausnahmslose, t\u00e4gliche Covid-Tests von Kindern und Betreuern erm\u00f6glichten ein unbeschwertes Miteinander im Anschluss, und so fanden sich die Kinder zwischen sechs und zw\u00f6lf Jahren am ersten Tag im \u201eWoibadinga\u201c in Wallersdorf in einer ungew\u00f6hnlichen Situation wieder: verwirrte Zeitreisende aus dem Mittelalter standen pl\u00f6tzlich in ihrer Mitte, wunderten sich \u00fcber seltsame Ger\u00e4te wie Lampen und Brillen und baten die Kinder um ihre Hilfe, wieder nach Hause zur\u00fcckzufinden. Im Zauberbuch von Kr\u00e4uterheilerin Frau Mona (Simone Vo\u00df) fand sich der entsprechende Zauber: \u00fcber drei Tage mussten sich die Kinder kleiden wie im Mittelalter, Namen aus deren Zeit annehmen und verschiedene andere Aufgaben l\u00f6sen. So wurden am ersten Tag mit Feuereifer Kost\u00fcme und Schmuck gebastelt. Nach einer St\u00e4rkung mit W\u00fcrstlsemmeln war es auch schon Zeit f\u00fcr die Taufe: Pater Ignatius (Erhard Jungbauer) verlieh den Kindern in einer feierlichen Zeremonie ihre Namen und Herzogin Leandra von Drachenstein (Christina Weig) stellte als adelige Schriftgelehrte die Taufzeugnisse aus.<br><br>Tag zwei fand auf dem Pausenhof der Grundschule Wallersdorf statt, der dankenswerter Weise f\u00fcr dieses Ferienprogramm genutzt werden durfte. Die Kinder malten unter anderem ein zehn Meter langes Bild mit Kreide, gestalteten Schwerter und Burgfr\u00e4uleinkr\u00e4nze und bereiteten das Turnier vor, welches das Zauberbuch verlangte. Bardin Morgana (Nicole Christlmeier) studierte ein Ritual ein, mit dem Zeitreisende aus anderen Zeiten vertrieben werden konnten, sollten diese auftauchen.<br><br>An Tag drei zeigten die Kinder mit einem Umzug durchs Dorf angef\u00fchrt von Wirt Xari (Enrico Koch), Junker Lukas (Lucas Scheermann), Junker Tato (Matthias Kettl) und Handwerkerin Annegret (Ramona Trautmannsberger) ihre Kost\u00fcme und wanderten zum Ort f\u00fcr den kr\u00f6nenden Abschluss: der Garten von Simone Vo\u00df und Thomas Marxreiter (Koch Luzifer) war in einen Schauplatz f\u00fcr das geplante Turnier verwandelt worden: eine gro\u00dfe Freifl\u00e4che bot Platz f\u00fcr die Turnierspiele und hinter der Feuerstelle f\u00fcr gem\u00fctliche Lagerfeuer erwartete die Herzogin in ihrem Prachtgewand die Kinder. Gemeinsam besprach man die Aufgaben f\u00fcr den Tag und er\u00f6ffnete feierlich das Turnier. H\u00f6hepunkt war dabei ein ritterliches Ringestechen, bei dem die Kinder auf einem ziehbar gelagerten Holzpferd sa\u00dfen und w\u00e4hrend der Fahrt mit einer Lanze einen Ring erwischen mussten. Die Kinder schrieben Briefe an sich selbst, die in einigen Wochen zugestellt werden und gelegentlich auftauchende Besucher aus anderen Zeiten wurden erfolgreich vertrieben. F\u00fcr das Festessen hatten sich Koch Luzifer und Marktfrau Susanna (Susanne Unger) selbst \u00fcbertroffen: neben einer Gem\u00fcsesuppe gab es Senkzelten und Bannocks am Lagerfeuer. Der Abend klang mit einer ruhigen Runde am Lagerfeuer aus, bei der Betreuer wie Kinder nacheinander Kr\u00e4uter ins Lagerfeuer warfen und dabei einen guten Wunsch f\u00fcr alle aussprachen. Alle Aufgaben waren erf\u00fcllt und so bestand kein Zweifel, dass die G\u00e4ste aus dem Mittelalter um Mitternacht sicher in ihre Zeit zur\u00fcckkehren w\u00fcrden.<br><br>Ein Dank aus tiefstem Herzen ergeht an alle Helferinnen und Helfer, die in der Vorbereitung und an den Einsatztagen selbst mit ihrem unerm\u00fcdlichen Einsatz, ihrer Hilfsbereitschaft und ihrem Willen, L\u00f6sungen zu finden statt Probleme zu sehen, dieses Ferienprogramm \u00fcber drei Tage von jeweils etwa sechs Stunden erm\u00f6glicht, und es zu einer wundervollen Erfahrung f\u00fcr Kinder und Betreuer werden haben lassen. Abgesehen von den oben Genannten halfen aktiv mit: Julia Zankl, Franziska Bachmeier und Anna-Lena Jungbauer. Ebenso ergeht an Dank an Frau Horineck, Direktorin der Grund- und Mittelschule Wallersdorf, f\u00fcr die Erlaubnis, das Schulgel\u00e4nde zu nutzen und einen Besuch an Tag zwei.",
    short: "Zurück in die Vergangenheit.",
    author: "Kinderlicht",
    image: "https://www.youtube.com/embed/AkCsF4e41JI?si=CXlQIie74DtIL8jZ",
    slug: "3-tage-mittelalter-ferienprogramm-2021",
    keywords: ["Spass", "Ferienprogramm", "Kinder", "Entlastung", "Gemeinwohl"],
  },
  {
    heading: "#Krippalkalender",
    date: new Date("2021-11-28"),
    content:
      "Genauer gesagt leuchten wir, beziehungsweise unser überlebensgroßes Krippal vorm Woibadinga in Wallersdorf.<br><br>Eine Übersicht über alle Türchen findet ihr in unserem Adventskalender.<br><br>Dort kann Jede und Jeder vorbeischauen, die/der an den Dezemberabenden gemütlich spazieren geht und einmal etwas anderes sehen möchte. Teilt die Aktion gerne weiter auf Social Media: für jedes Selfie mit dem Hashtag #krippalkalender legen wir 1€ in einen Spendentopf. Jede Spende, die während der Aktion bei uns eingeht und das Kennwort „Krippalkalender“ enthält, stocken wir auf (Die Stufen sind unten angeführt) und der gesamte Erlös geht an den VKKK Regensburg (https://www.vkkk-ostbayern.de/).<br><br>Und weil die „staade Zeit“ die letzten Jahre gar so „staad“ war, haben wir uns etwas ganz Besonderes überlegt: Jeden Tag öffnet sich ein Türchen unseres virtuellen Adventskalenders und dahinter verbergen sich unsere Mitglieder, die Euch mit lustigen oder besinnlichen, informativen und spannenden Zehn-Minuten-Livestreams unterhalten.<br><br>Zu sehen sind die überall, wo wir im Netz sind: Facebook, Instagramm, YouTube oder direkt auf unserer Homepage.<br><br>Schaut vorbei! Wir freuen uns auf Euch!<br><br><table>    <tr>        <th>Gesamt</th>        <th>Das legen wir oben drauf:</th>    </tr>    <tr>        <td>5001 € oder mehr</td>        <td>2500 €</td>    </tr>    <tr>        <td>4001 € – 5000 €</td>        <td>2000 €</td>    </tr>    <tr>        <td>3001 € – 4000 €</td>        <td>1500 €</td>    </tr>    <tr>        <td>2001 € – 3000 €</td>        <td>1000 €</td>    </tr>    <tr>        <td>1001 € – 2000 €</td>        <td>750 €</td>    </tr>    <tr>        <td>0 € – 1000 €</td>        <td>500 €</td>    </tr></table>",
    short: "Advent, Advent, Kinderlicht brennt.",
    author: "Kinderlicht",
    image: "https://www.youtube.com/embed/bGR75Cy2BrU?si=8pdpDYX95ZwF5_oZ",
    slug: "kinderlicht-wallersdorf-e-v-weihnachtsaktion",
    keywords: [
      "Advent",
      "Weihnachten",
      "Film",
      "Aktion",
      "Veranstaltung",
      "Stream",
      "Online",
      "Spenden",
    ],
  },
  {
    heading: "Frauenliste feiert Tag der heiligen Lucia am Krippalkalender",
    date: new Date("2021-12-21"),
    content:
      "Am 13.12. war die Frauenliste zu Gast am Krippal - als heilige Lucia und ihre Lichterbringerinnen verteilten sie vor dem Woibadinga kleine „Lichtertüten“. Gefüllt sind diese mit kleinen Adventgaben, Lichtlein, Papierengelchen und einer Geschichte. Anschließend erzählte Susanne Unger unterstützt von Simone Koller im Rahmen des Krippalkalenders die Geschichte der heiligen Lucia als Kamishibai.<br><br>Auf einem Teller lagen während der nächsten Tage liebevoll gebastelte Schoko-Sterne für Kinder zum Abholen und Genießen.<br><br>Vielen Dank an die engagierten Damen der Frauenliste für diese schöne Aktion!",
    short: "Was steckt wohl hinter Türchen 13.",
    author: "Kinderlicht",
    image:
      "/news/frauenliste-feiert-tag-der-heiligen-lucia-am-krippalkalender.jpg",
    slug: "frauenliste-feiert-tag-der-heiligen-lucia-am-krippalkalender",
    keywords: [
      "Advent",
      "Weihnachten",
      "Film",
      "Aktion",
      "Veranstaltung",
      "Stream",
      "Online",
      "Spenden",
    ],
  },
  {
    heading: "Hilfe f\u00fcr die Ukraine",
    date: new Date("2022-03-05"),
    content:
      "Die Ereignisse, die unsere Welt ersch\u00fcttern, \u00fcberschlagen sich im Moment.<br><br>In den letzten Tagen und Wochen haben viele Menschen ihre Heimat verloren und mussten nur mit dem N\u00f6tigsten im Gep\u00e4ck fliehen.<br><br>Wir alle m\u00f6chten ihnen helfen, doch was wird gebraucht?<br><br>Zuallererst gilt es, f\u00fcr ein Dach \u00fcber dem Kopf zu sorgen. Das Landratsamt Dingolfing-Landau hat hier eine Koordinierungsstelle eingerichtet. \u00dcber das Formular auf der Homepage kann sich Jede und Jeder mit einer freien Unterkunft registrieren.<br><br>Genauso wichtig sind auch Alltagsgegenst\u00e4nde. Nachfolgend haben zwei Anlaufstellen aus der Region aufgelistet, die wir Euch f\u00fcr Sachspenden besonders ans Herz legen m\u00f6chten. Lest jedoch bitte die Beschreibung genau, welche Artikel gebraucht werden.<br><br>Auch die im Moment best\u00e4ndig t\u00e4tigen Hilfsorganisationen ben\u00f6tigen jede Unterst\u00fctzung. Besonders m\u00f6chten wir hier den \u00c4rzte der Welt e.V. und die SOS Kinderd\u00f6rfer empfehlen.",
    short: "Zusammenhelfen in Krisenzeiten.",
    author: "Kinderlicht",
    image: "/news/peace.jpg",
    slug: "hilfe-fuer-die-ukraine",
    keywords: ["Ukraine", "Helfen", "Krise"],
  },
  {
    heading: "JHV 2022",
    date: new Date("2022-04-02"),
    content:
      "Im Vereinslokal \u201eWoibadinga\u201c fand in der vergangenen Woche die Jahresversammlung von Kinderlicht statt. Vorsitzender Enrico Koch begr\u00fc\u00dfte dazu die Mitglieder, besonders B\u00fcrgermeister Franz Aster.<br><br>Christina Weig blickte mit den Anwesenden auf ein erfolgreiches Jahr zur\u00fcck. Trotz pandemiebedingten Einschr\u00e4nkungen hat es der Verein geschafft, zwei Veranstaltungen abzuhalten. Man beteiligte sich am Ferienprogramm der Marktgemeinde und konnte den fast 20 teilnehmenden Kindern drei Tage lang Spannung und Spa\u00df im Mittelalter erm\u00f6glichen. Auch der \u201eKrippalkalender\u201c war ein voller Erfolg. Als Adventskalender wurde jeden Tag live gestreamt und alle die es w\u00fcnschten konnten auf den Social Media Kan\u00e4len zuschauen. Als Highlights waren hier ein Feuerspucker, eine Hexe und das Christkind zu besuch. Die Streams k\u00f6nnen auf Youtube auch nachtr\u00e4glich noch eingesehen werden. Die Einnahmen werden auf etwas \u00fcber 3.000 \u20ac aufgestockt und kommen dem VKKK zugute.<br><br>Kassier Julian Dietlmeier lie\u00df einen Bericht \u00fcber die Zahlen folgen: der Verein hat derzeit 58 Mitglieder und erhielt im Jahr 2021 \u00fcber 12.000 \u20ac an Spenden. <br><br>Vorsitzender Enrico Koch nutzte den Moment, um eine Zwischenbilanz zu ziehen: seit Vereinsgr\u00fcndung hat Kinderlicht 42.000 \u20ac an Spenden erhalten und 11.000 \u20ac selbst erwirtschaftet. Er dankte den tatkr\u00e4ftigen Mitgliedern, die dies durch ihren unerm\u00fcdlichen Einsatz erm\u00f6glichten.<br><br>Kinderlicht f\u00fchrte nun einen Familienbeitrag ein, spezielle Gedanken habe man sich auch in Bezug auf alleinerziehende Eltern mit Kind gemacht, die oft nicht die Anforderungen eines Familienbeitrags erf\u00fcllen. Auch diese erhalten hier die Verg\u00fcnstigungen. <br><br>Vor der Wahl der neuen Vorstandschaft wurde die alte entlastet. Die bisherigen Vorstandsmitglieder setzen die Ausf\u00fchrung ihrer \u00c4mter fort, und als Beisitzerin unterst\u00fctzt nun Ramona Trautmannsberger das Team. <br><br>B\u00fcrgermeister Franz Aster bedankte sich bei allen Anwesenden f\u00fcr den geleisteten Einsatz und versprach die Unterst\u00fctzung der Marktgemeinde bei weiteren Vorhaben. Er lud zur Unterst\u00fctzung des Spendenlaufs der Grund- und Mittelschule am 7.4. und 8.4. ein, die f\u00fcr \u201eSave the Children\u201c laufen. Kinderlicht \u00fcbernimmt hier die Vermittlung der Spenden und somit k\u00f6nnen alle Unterst\u00fctzer auf das Spendenkonto DE 04 7419 1000 0007 724314 mit dem Kennwort \u201eSpendenlauf\u201c einzahlen.<br><br>Damit lie\u00df man den Abend bei einem gem\u00fctlichen Beisammensein ausklingen.",
    short: "Jahreshauptversammlung: Trotz Krisen, positive Bilanz.",
    author: "Kinderlicht",
    image: "/news/jhv-2022.jpg",
    slug: "jahreshauptversammlung-2022",
    keywords: ["JHV", "Jahreshauptversammlung", "Gemeinwohl", "Verein"],
  },
  {
    heading: "Spenden\u00fcbergabe an den VKKK",
    date: new Date("2022-04-14"),
    content:
      "Im Advent 2021 fand in Wallersdorf der erste \u201eKrippalkalender\u201c statt, eine Livestreaming Aktion, bei der sich an jedem Tag des Advents ein online-T\u00fcrchen \u00f6ffnete. Dahinter standen Freunde und Mitglieder von Kinderlicht und vers\u00fc\u00dften den Zuschauern auf lustige, spektakul\u00e4re, oder auch nachdenkliche Art den Abend. Als Highlights waren hier ein Feuerschlucker, das Christkind und sogar eine Hexe zu Besuch. Einsehbar sind die Streams auch nachtr\u00e4glich noch auf Youtube. Mit den Suchworten \u201eKrippalkalender Kinderlicht\u201c k\u00f6nnen diese schnell gefunden werden. <br><br>Mit der Aktion sollte neben der Unterhaltung in der \u201ezu staaden Zeit\u201c auch Spenden f\u00fcr den VKKK gesammelt werden. Alle eingegangenen Spenden stockte Kinderlicht noch einmal auf und so ergab sich insgesamt ein stolzer Betrag von 3346 \u20ac, den wir Beiratsmitglied Herrn Osterholt vom VKKK dann schlussendlich \u00fcbergeben konnten. Der \u201eVerein zur F\u00f6rderung krebskranker und k\u00f6rperbehinderter Kinder Ostbayern e. V.\u201c unterst\u00fctzt die Familien w\u00e4hrend der Klinikbehandlungen, aber auch danach. So werden den Eltern Wohnungen neben den Krankenh\u00e4usern zur Verf\u00fcgung gestellt, f\u00fcr die Kinder wurde ein Spielplatz gebaut und die Familien bei Bedarf auch finanziell unterst\u00fctzt. <br><br>Weitere Infos zum VKKK unter www.vkkk-ostbayern.de<br><br>Ein herzliches Dankesch\u00f6n ergeht an alle, die diese Aktion vor und hinter der Kamera m\u00f6glich gemacht haben und nat\u00fcrlich an alle Spenderinnen und Spender. Beim VKKK wissen wir: da ist das Geld gut aufgehoben. ",
    short: "Geldsegen zu Weihnachten.",
    author: "Kinderlicht",
    image: "/news/donation.jpg",
    slug: "spendenuebergabe-an-den-vkkk",
    keywords: [
      "Weihnachten",
      "Stream",
      "Aktion",
      "Kalender",
      "Advent",
      "VKKK",
      "Spenden",
    ],
  },
  {
    heading: "Flagge gezeigt",
    date: new Date("2022-07-18"),
    content:
      "Wallersdorf. Das Wallersdorfer Volksfest durfte nach 2 Jahren Pandemie 2022 endlich wieder durchgef\u00fchrt werden. Auch der Kinderlicht Wallersdorf e. V. war hierbei mit seinen Mitgliedern wieder zahlreich vertreten und pr\u00e4sentierte beim Ausmarsch zum Volksfestplatz die neu erworbene Fahne, welche k\u00fcnftig den Verein bei Veranstaltungen und Festen begleiten wird.<br>Man freute sich auf gesellige Abende sowie einen angenehmen Austausch unter den Mitgliedern bei einer Brotzeit, einem Hendl und einer k\u00fchlen Ma\u00df.<br>So konnten k\u00fcnftige Termine wie z. B. das Ferienprogramm oder ein weiterer Ball sowie andere Feste und Veranstaltungen besprochen werden. Endg\u00fcltige Entscheidungen folgen in K\u00fcrze.",
    short: "Kinderlicht auf dem Volksfest.",
    author: "Kinderlicht",
    image: "/news/flagge-gezeigt.jpg",
    slug: "flagge-gezeigt",
    keywords: ["Verein", "Gemeinwohl", "Aktion", "Spass", "Zusammen"],
  },
  {
    heading: "Ab ins Beet",
    date: new Date("2022-07-18"),
    content:
      "Straubing. Eine interessante Anfrage erhielt der Verein Kinderlicht e. V. Anfang des Jahres vom Thomas-Wiser-Haus. Die therapeutische und heilp\u00e4dagogische Einrichtung f\u00fcr Kinder und Jugendliche w\u00fcnschte sich f\u00fcr den hauseigenen Garten ein Hochbeet zur Bepflanzung saisonalem Gem\u00fcse.<br><br>Nat\u00fcrlich waren wir sofort am Start \u2013 doch nur wer s\u00e4t, der kann auch ernten. So wollten wir die Kinder vom ersten Schritt an einbeziehen. Durch Unterst\u00fctzung der Schreinerei Hirschbichler (Altenbuch) und Firma Scheermann (Wallersdorf) konnten die Bretter, die Schrauben und die verschiedenen Erdschichten transportiert und anschlie\u00dfend verarbeitet werden.<br><br>Die Kinder durften dabei selbst bohren, schrauben, bef\u00fcllen, streichen etc. und waren somit vom ersten bis zum letzten Schritt dabei. Die gute Versorgung des Thomas Wiser Haus, lie\u00df die flei\u00dfigen Bienchen umso motivierter Arbeiten.<br><br>Die ersten Samen wurden bereits ges\u00e4t und wir hoffen auf eine gro\u00dfe Ausbeute die n\u00e4chsten Jahre und auf evtl. weitere sch\u00f6ne Projekte!",
    short: "Grün sind alle meine Farben.",
    author: "Kinderlicht",
    image: "/news/beet.jpg",
    slug: "ab-ins-beet",
    keywords: ["Umwelt", "Aktion", "Kinder", "Helfen"],
  },
  {
    heading: "Renovieren in 4-W\u00e4nden",
    date: new Date("2022-07-18"),
    content:
      "Wallersdorf. Nachdem eine Familie bei einem Gro\u00dfbrand alles verloren hatte, war f\u00fcr den Kinderlicht e. V. sofort klar, wir lassen euch nicht h\u00e4ngen.<br>Anfangs unterst\u00fctze man die Spendenaktion des Wallersdorfer Netzwerks mit Spendenaufrufen und half anschlie\u00dfend bei der Suche nach einer \u00fcbergangswei\u00dfen \u00dcbernachtungsm\u00f6glichkeit. Durch die Bereitschaft des Br\u00e4uhof Wallersdorfs und der Pension Jederzeit musste sich die Familie bis zur Wohnungsfindung keine Gedanken \u00fcber Obdach machen.<br>Durch die Bem\u00fchungen des B\u00fcrgermeister Aster konnte auch schnell eine neue Wohnung f\u00fcr die Familie gefunden werden, welche noch ein paar Renovierungsarbeiten n\u00f6tig hatte.<br>Die flei\u00dfigen \u201eKinderlichter\u201c waren sofort wieder zahlreich an der Stelle und halfen beim Streichen, beim Ab- und Aufbau von M\u00f6beln sowie dem Transport neuer Einrichtungsst\u00fccke, sodass die Familie innerhalb k\u00fcrzester Zeit einziehen konnte.<br>Wir w\u00fcnschen der Familie von Herzen alles Gute und gemeinschaftliche Abende im neuen Zuhause.",
    short: "Selbst sind die Kinderlichter.",
    author: "Kinderlicht",
    image: "/news/rennovierung.jpg",
    slug: "renovieren-in-4-waenden",
    keywords: ["Helfen", "Aktion", "Bauen", "Umwelt", "Handwerk"],
  },
  {
    heading: "Schiff Ahoi!",
    date: new Date("2022-10-01"),
    content:
      "Wallersdorf, 01.09.2022. Vor ein paar Tagen erhielten 20 Kinder in der Marktgemeinde eine kleine Flaschenpost. Darin enthalten, der Brief von Lilly Feuerzopf, eine Seer\u00e4uberin, die neue und tapfere Piraten und Seer\u00e4uber*innen sucht, auf der R\u00fcckseite eine Schatzkarte \uf0e0 das Kreuz markiert den Start. Gesucht \u2013 Gefunden.<br><br>Am Dienstag, den 30.08. trafen die Abenteurer im Woibadinga ein, um gemeinsam die ersten Aufgaben der Seefahrt zu meistern. Ein eigenes Seemannsgewand basteln, einen Seer\u00e4ubernamen erhalten und eine Schatzkiste bemalen und nat\u00fcrlich ein Logbuch f\u00fchren, um dann eine weitere Schatzkarte zu finden, das Ziel: der Mehrgenerationenpark.<br><br>Angef\u00fchrt vom Matrosen Eddy (Susanne Unger) und Captain Rick (Enrico Koch), sowie begleitet von den Seer\u00e4uberin Traudl (Ramona Trautmannsberger), Schiffsmusikantin Colly (Nicole Christlmeier) wurden im Park mehrere Aufgaben gel\u00f6st und Sch\u00e4tze gefunden. Ein Fluss musste \u00fcberquert, Piratenspiele gel\u00f6st, ein Tanz einstudiert und die Seemannssprache erlernt werden. Au\u00dferdem wurde ein mobiles Schiff gebaut, welches f\u00fchr echte Seefahrer nat\u00fcrlich zur Grundausstattung z\u00e4hlt. Zur Durchf\u00fchrung, dem Aufbau sowie den Transporten unterst\u00fctzen die Seemannstruppe bestehend aus Christina Weig, Matthias Kettl, Theresa Kettl & Anna Jungbauer.<br><br>Zur St\u00e4rkung gab es traditionsgerecht echte Rippchen der Metzgerei Wals, die Knochen wurden selbstverst\u00e4ndlich in der Mitte des Schiffs zusammengeworfen, sowie gesunde Piratensnacks und s\u00fc\u00dfe Muffins der Schiffsk\u00fcche, hergestellt von Carmen Hutterer und Petra Spranger. Der erste Tag endete mit einer gro\u00dfen Wasserbombenschlacht alias dem Schiffeversenkenspiel.<br><br>Am n\u00e4chsten Tag wurde sich wieder im MGP getroffen, um dort die Logb\u00fccher zu aktualisieren, den einstudierten Tanz nochmal zu \u00fcben und die Seemannssprache aufzufrischen. Doch da kam auch schon der Captain angest\u00fcrmt, verzweifelt, schlapp, mit einem blauen Auge. \u201eDer Schatz wurde gestohlen! Die Wikinger haben uns \u00fcberfallen!\u201c. Daher hie\u00df es, alle aufs Schiff, wir ziehen los.<br><br>Auf dem Weg trafen die kleinen Seer\u00e4uber auf Neptuns Tochter (Simone Voss), die feststellte, dass die Kinder noch gar keine Neptuntaufe erhalten haben und sich so auf keinen Fall in den Gew\u00e4ssern des Meeresgottes aufhalten d\u00fcrften. So rief sie den m\u00e4chtigen Neptun (Tom Maxreiter), der im Nebel im Rei\u00dfinger Bach erschien und zu den Kindern aufstieg. Ein Hescher (Manuel Grill) wurde von ihm beauftragt Captain Rick zu fangen, um das Taufritual vorzuf\u00fchren. Dabei musste ein Meerestrank getrunken, der zu taufende rasiert und anschlie\u00dfend im Bach gewaschen werden. Der Hescher konnte es sich dabei nicht nehmen lassen, den Captain in den Bach zu werfen, das die Kinder lachend unterst\u00fctzten. Und so wurde Kind f\u00fcr Kind von Neptun getauft und mit einem Ring und einer Taufurkunde belohnt.<br><br>Die Kinder waren nun echte Seer\u00e4uber und durften jetzt sogar andere Schiffe \u00fcberfallen. Also zogen sie los Richtung Marktplatz, um dort den Hunger zu stillen, indem die Metzgerei Wals mit einem lautstarken \u201eAttakeeeeee!\u201c \u00fcberfallen wurde. Nach einer St\u00e4rkung galt es den einstudierten Tanz am Marktplatz vorzuf\u00fchren und den b\u00f6sen Wal zu besiegen.<br><br>Der Schiffszug endete im Garten der Familie Voss/Maxreiter, in dem ein lebensgro\u00dfes Piratenschiff durch die Familie aufgebaut wurde. Dort gefesselt war der B\u00fcrgermeister, der beim Tauchen den gestohlenen Schatz fand. Die Kinder l\u00f6sten Aufgaben und gelangten so ihren gro\u00dfen Schatz zur\u00fcck, der auf alle Beteiligten aufgeteilt wurde.<br><br>Bilder: V. Lengfelder / vereinsintern",
    short: "Keine Macht den Seeratten.",
    author: "Kinderlicht",
    image: "/news/schiff-ahoi.jpg",
    slug: "schiff-ahoi",
    keywords: ["Ferienprogramm", "Aktion", "Kinder", "Entlastung"],
  },
  {
    heading: "Wohnung f\u00fcr ukrainische Familie gesucht!",
    date: new Date("2022-11-01"),
    content:
      "In der E-Jugend der DJK Altenkirchen spielt ein aus der Ukraine gefl\u00fcchteter Junge. Der Wohnort Liman der Familie ist nahezu vollst\u00e4ndig zerst\u00f6rt. Leider muss die Familie aus der aktuellen Wohnung ausziehen. Daher sind sie auf der Suche nach einer dauerhaften Unterkunft zur Miete. Wenn ihr weiterhelfen k\u00f6nnt, meldet euch bitte bei uns! Wir k\u00fcmmern uns dann um den Aufbau des Kontakts.",
    short: "Wir suchen eine Wohnung.",
    author: "Kinderlicht",
    image: "/news/peace.jpg",
    slug: "wohnung-fuer-ukrainische-familie-gesucht",
    keywords: ["Aktion", "Aufruf", "Krise", "Helfen", "Kinder"],
  },
  {
    heading: "Kinderlicht Wallersdorf bei Niederbayern TV",
    date: new Date("2022-11-09"),
    content:
      "Wallersdorf. Es war einiges los in der wohl schaurigsten Nacht des Jahres. Der Kinderlicht Wallersdorf e. V. hat eine kleine Halloween-Tour vorbereit und Kindern erm\u00f6glicht gemeinsam um die H\u00e4user zu ziehen. Dabei sollten gezielt deren Eltern entlastet werden und den Kindern ein paar sch\u00f6ne Stunden geschenkt werden.<br><br>Ein besonderes Highlight f\u00fcr alle Beteiligten war dabei der Besuch von Radiomoderator Bernhard Fleischmann alias Fleischi, der zusammen mit Niederbayern TV an einer neuen Folge f\u00fcr \u201eFleischis kleiner Wanderzirkus\u201c arbeitete.<br><br>Die rund 15 Kinder durften dabei den Moderator schminken und verkleiden. Auch passende Spiele wurden gespielt. So versuchte Fleischi sich an dem beliebten Partyspiel Topfschlagen, bis er die S\u00fc\u00dfigkeiten fand. Und auch ein gemeinsamer Spruch musste erlernt werden, um m\u00f6glichst viel S\u00fc\u00dfes zu erbeuten. \u201eWir haben leere Taschen und wollen was zum Naschen!\u201c hallte es durch den Raum, bis der Raubzug begann.<br><br>Als erste Station wurde das Rathaus in Wallersdorf angesteuert. Leise schlich man sich die Treppen hoch, bis zum Amtszimmer des B\u00fcrgermeisters, um mit gro\u00dfem Gebr\u00fcll die Botschaft zu \u00fcbermitteln. Top vorbereitet \u00fcberreichte Franz Aster (GEB) den Kindern zwei volle Sch\u00fcsseln mit S\u00fc\u00dfigkeiten und nichts blieb \u00fcber.<br><br>Bis zur n\u00e4chsten offiziellen Station waren es ein paar Schritte, sodass man die am Weg liegenden H\u00e4user nutzte und auch hier die Taschen f\u00fcllte. An einem gruseligen Garten hielt man inne, kurz traute sich niemand zu klingeln, bis sich ein mutiger Junge fand. Da kam auch schon eine schaurige Hexe ums Eck, die sich \u00fcber den Besuch der Kinder sehr freute. Auch von ihr wurde von den Kindern S\u00fc\u00dfes gefordert, auch wenn der Anblick der Hexe f\u00fcr die ein oder den anderen etwas gruslig und die Frage nach Bonbons z\u00f6gerlich wirkte. Doch die Halloween-Hexe alias Ingrid Ast (Frauenliste) hatte einen Teller mit gruseligen Leckereien parat, bei dem sich jede/r bedienen konnte.<br><br>Weiter ging die Reise, von Haust\u00fcr zu Haust\u00fcr, Stra\u00dfe um Stra\u00dfe, bis die Taschen zum Platzen voll waren und die Kinder wohl bis zum n\u00e4chsten Halloween vorsorgt waren \u2013 oder zumindest bis Dienstag.",
    short: "Kinderlicht im TV.",
    author: "Kinderlicht",
    image: "/news/halloween.jpg",
    slug: "niederbayern-tv",
    keywords: ["TV", "Aktion", "Halloween", "Kinder", "Entlastung"],
  },
  {
    heading: "Die vier Jahreszeiten",
    date: new Date("2023-04-05"),
    content: "Stolz präsentieren wir hier unseren ersten Kinofilm.",
    short: "Unser erster Kinofilm.",
    author: "Kinderlicht",
    image: "https://www.youtube.com/embed/ZRj34XeuHCY?si=AELGeu81yqElL_45",
    slug: "vier-jahreszeiten",
    keywords: ["Aktion", "Gemeinwohl", "Spass", "Kino", "Film", "Musik"],
  },
  {
    heading: "Valentinsaktion an Berufsschule",
    date: new Date("2023-04-05"),
    content:
      "Manchmal hat Liebe mit Geld zu tun. Und mit Einsatzbereitschaft, Kreativit\u00e4t und Spa\u00df. Unter dem Motto \u201eUns wird`s warm ums Herz\u201c f\u00fchrte die Kaufm\u00e4nnischen Berufsschule eine besondere Benefizveranstaltung durch. <br><br>Der traditionelle Punschverkauf vor Weihnachten musste wegen der defekten Heizanlage im Schulzentrum auf den Valentinstag verschoben werden. Da auch noch der Unsinnige Donnerstag in diese Woche fiel, wurden an mehreren Tagen selbstgebackene Kuchen, Muffins und Punsch verkauft. Aber den Sch\u00fclerinnen und Sch\u00fclern wurde nicht nur durch den hei\u00dfen Punsch recht warm ums Herz, spontan wurden auch Rosen und Herzluftballons verkauft. Zu verdanken war der sch\u00f6ne Erfolg dem Engagement und dem Ideenreichtum der Klassensprecher und der SMV, die zusammen mit Frau Sabine Hundt diese Valentinsaktion organisierten. <br><br>Alle Sch\u00fclerinnen und Sch\u00fcler stimmten zuvor gemeinsam ab, dass die erzielten Einnahmen dem \u00f6rtlichen Tierheim und dem Verein Kinderlicht aus Wallersdorf zugutekommen sollten. Frau Marion Schuhbaum nahm den Scheck \u00fcber 350 \u20ac f\u00fcr das Deggendorfer Tierheim dankbar entgegen und erkl\u00e4rte den Klassensprechern, wof\u00fcr das Geld ausgegeben wird. Ber\u00fchrt von der Not der Tiere, wissen die Sch\u00fclerinnen und Sch\u00fcler das Geld in guten H\u00e4nden.<br><br>Der ehemalige Sch\u00fcler der KBS, Herr Enrico Koch, arbeitet ehrenamtlich im Verein Kinderlicht in Wallersdorf. Dieser Verein unterst\u00fctzt sozial benachteiligte, insbesondere an Krebs erkrankte Kinder in unserer Region. Auch er vermittelte den Klassensprechern seinen Dank und zeigte viele Aktionen seines Vereins, der versucht die schwierige Situation einiger Notleidenden etwas finanziell abzusichern.<br><br>Leider ereignete sich zwischenzeitlich das schwere Erdbeben in der T\u00fcrkei und Syrien, so dass zus\u00e4tzlich noch ein Teil der Einnahmen an das Rote Kreuz f\u00fcr die Internationale Hilfe im Erdbebengebiet gespendet wurde. <br><br>Freude und Spa\u00df standen bei der Durchf\u00fchrung im Mittelpunkt, Menschlichkeit und Hilfsbereitschaft im Vordergrund der gesamten Aktion.",
    short: "Mit viel Liebe (und Geld).",
    author: "Kinderlicht",
    image: "/news/valentinsaktion-an-der-kaufmaennischen-berufsschule.jpg",
    slug: "valentinsaktion-an-der-kaufmaennischen-berufsschule",
    keywords: ["Spende", "Helfen", "Aktion", "Valentinstag"],
  },
];

export const ConvertDate = (date: Date) => Intl.DateTimeFormat().format(date);

export const NewsItemLink = (item: NewsItem) => `/neues/${item["slug"]}`;
