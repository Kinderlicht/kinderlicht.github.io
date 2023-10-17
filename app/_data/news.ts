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

export const news_data: NewsItem[] = [
  {
    slug: "neue-website",
    date: new Date("2019-05-03"), //["2019", "05", "03"],
    heading: "Neue Webseite",
    short: "Wir präsentieren unsere neue Webseite.",
    content:
      "Mit der Gründung unseres Vereins haben wir auch die örtlichen Medien auf uns aufmerksam gemacht und durften das ein oder andere Interview geben. Auf die Frage, was wir uns denn für die Zukunft wünschen, hat Enrico Koch mit einem Schmunzeln gemeint “Ein Schirmherr wad ned schlecht”. Wobei aus dieser spontanen, humorvollen Aussage schlussendlich die Schlagzeile eines Berichts wurde - “Kinderlicht sucht Helfer und Schirmherrn”.<br><br>Nur wenige Stunden nach Auslieferung der besagten Zeitung bekam Enrico Koch einen Telefon-Anruf: Florian Pronold, Bundestagsabgeordneter und Parlamentarischer Staatssekretär, bot an, die Schirmherrschaft zu übernehmen. “Weil es mich beeindruckt, dass junge Leute einen Verein gründen, der da ansetzt, wo klassische Strukturen nicht mehr helfen können und weil ich die Idee witzig fand, eine Schirmherrschaft über die Zeitung zu suchen.”, begründete Florian Pronold uns seine Unterstützung.<br><br>“Ich habe selbst in meinem Bekanntenkreis erlebt, wie einschneidend die schwere Krankheit eines kleinen Kindes für eine Familie sein kann.” erklärte er uns. Die psychische Belastung für Betroffene sei enorm. Hinzu komme, dass trotz Gesundheitssystem oftmals die vorhandenen Strukturen nicht ausreichen – insbesondere, wenn einem Kranken mal ein Wunsch erfüllt werden soll. “ Dass sich junge Leute hier einsetzten und einen Verein gründen, finde ich beeindruckend”, lobte er uns und versprach seine Unterstützung: “Ich stelle bei Bedarf gerne mein Wissen zur Verfügung und mache Werbung für euch!”<br><br>Wir wären sehr beeindruckt von dem amtierenden Parlamentarischem Staatssekretär und SPD-Vorsitzendem des Wahlkreises Rottal-Inn, sodass wir nach Absprache mit unserer Vorstandschaft und unseren Mitgliedern uns dazu entschlossen haben, die Schirmherrschaft zu besiegeln.<br><br>Dabei haben wir uns klar definiert und erklärt, dass die Schirmherrschaft nicht aufgrund von eventuellen Gemeinsamkeiten zwischen unserem Verein und der SPD entsteht, sondern dadurch, dass sich ein regionaler Politiker bzw. eine Person der Öffentlichkeit für das Engagement unseres Vereins interessiert und uns mit seiner Funktion bzw. Bekanntheit und der verbundenen Öffentlichkeitsarbeit dementsprechend fördert und fördern möchte.<br><br>Diese Position bzw. Unterstützungsmöglichkeit wurde durch unseren Aufruf in besagtem Zeitungsartikel jeder Person im Landkreis, und darüber hinaus, in Form einer Schirmherrschaft bereiterklärt und wird natürlich auch weiterhin angeboten. Wir sind über jede Form der Unterstützung dankbar. Bislang haben wir keine weiteren Interessenten erreichen können.<br><br>Sicherlich hätten wir bekannte Persönlichkeiten anfragen und animieren können, allerdings ist es nicht in unserem Interesse Leute zwanghaft von uns zu überzeugen. Ebenfalls wollen wir uns keiner Personengruppe / Partei / Organisation oder Ähnlichem verschreiben. Wir möchten, dass interessierte Personen am Kinderlicht e. V. Gefallen finden und sich freiwillig anschließen.<br><br>Mit Florian Pronold an unserer Seite haben wir genau eine solche Person gefunden. Er versicherte uns seine ununterbrochene Bereitschaft zur Unterstützung mit seinem Wissen als Rechtsanwalt, seinem Marketing und Social-Media-Bereich, seinem Netzwerk bzw. seiner allgemeinen Bekanntheit.<br><br>Bei einem persönlichen Treffen zwischen Florian Pronold und unserer Vorstandschaft durften wir uns von dem künftigen Schirmherrn ein Bild machen. Florian Pronold ist bzgl. unseres Vereins absolut unparteiisch und lässt Politik und daraus resultierendes Eigeninteresse außen vor und überraschte uns mit seinem breiten Netzwerk an Bekannten und Freunden, welche dem Verein bei künftigen Veranstaltungen zur Seite stehen können.<br><br>Es freut uns immer wieder, wenn wir Leute mit unseren Ideen und Projekten begeistern können und unsere Bekanntheit von Woche zu Woche wächst. Gemeinsam können wir etwas bewirken – Weil “Nix” wird eh scho z’oft do! –<br><br>Enrico Koch",
    image: "/news/webseite.jpg",
    author: "Kinderlicht",
    keywords: ["intern", "webseite"],
  },
  {
    slug: "schirmherrschaft",
    date: new Date("2019-05-05"),
    heading: "Schirmherrschaft",
    short: "hallo erstmal",
    content:
      "Mit der Gründung unseres Vereins haben wir auch die örtlichen Medien auf uns aufmerksam gemacht und durften das ein oder andere Interview geben. Auf die Frage, was wir uns denn für die Zukunft wünschen, hat Enrico Koch mit einem Schmunzeln gemeint “Ein Schirmherr wad ned schlecht”. Wobei aus dieser spontanen, humorvollen Aussage schlussendlich die Schlagzeile eines Berichts wurde - “Kinderlicht sucht Helfer und Schirmherrn”.<br><br>Nur wenige Stunden nach Auslieferung der besagten Zeitung bekam Enrico Koch einen Telefon-Anruf: Florian Pronold, Bundestagsabgeordneter und Parlamentarischer Staatssekretär, bot an, die Schirmherrschaft zu übernehmen. “Weil es mich beeindruckt, dass junge Leute einen Verein gründen, der da ansetzt, wo klassische Strukturen nicht mehr helfen können und weil ich die Idee witzig fand, eine Schirmherrschaft über die Zeitung zu suchen.”, begründete Florian Pronold uns seine Unterstützung.<br><br>“Ich habe selbst in meinem Bekanntenkreis erlebt, wie einschneidend die schwere Krankheit eines kleinen Kindes für eine Familie sein kann.” erklärte er uns. Die psychische Belastung für Betroffene sei enorm. Hinzu komme, dass trotz Gesundheitssystem oftmals die vorhandenen Strukturen nicht ausreichen – insbesondere, wenn einem Kranken mal ein Wunsch erfüllt werden soll. “ Dass sich junge Leute hier einsetzten und einen Verein gründen, finde ich beeindruckend”, lobte er uns und versprach seine Unterstützung: “Ich stelle bei Bedarf gerne mein Wissen zur Verfügung und mache Werbung für euch!”<br><br>Wir wären sehr beeindruckt von dem amtierenden Parlamentarischem Staatssekretär und SPD-Vorsitzendem des Wahlkreises Rottal-Inn, sodass wir nach Absprache mit unserer Vorstandschaft und unseren Mitgliedern uns dazu entschlossen haben, die Schirmherrschaft zu besiegeln.<br><br>Dabei haben wir uns klar definiert und erklärt, dass die Schirmherrschaft nicht aufgrund von eventuellen Gemeinsamkeiten zwischen unserem Verein und der SPD entsteht, sondern dadurch, dass sich ein regionaler Politiker bzw. eine Person der Öffentlichkeit für das Engagement unseres Vereins interessiert und uns mit seiner Funktion bzw. Bekanntheit und der verbundenen Öffentlichkeitsarbeit dementsprechend fördert und fördern möchte.<br><br>Diese Position bzw. Unterstützungsmöglichkeit wurde durch unseren Aufruf in besagtem Zeitungsartikel jeder Person im Landkreis, und darüber hinaus, in Form einer Schirmherrschaft bereiterklärt und wird natürlich auch weiterhin angeboten. Wir sind über jede Form der Unterstützung dankbar. Bislang haben wir keine weiteren Interessenten erreichen können.<br><br>Sicherlich hätten wir bekannte Persönlichkeiten anfragen und animieren können, allerdings ist es nicht in unserem Interesse Leute zwanghaft von uns zu überzeugen. Ebenfalls wollen wir uns keiner Personengruppe / Partei / Organisation oder Ähnlichem verschreiben. Wir möchten, dass interessierte Personen am Kinderlicht e. V. Gefallen finden und sich freiwillig anschließen.<br><br>Mit Florian Pronold an unserer Seite haben wir genau eine solche Person gefunden. Er versicherte uns seine ununterbrochene Bereitschaft zur Unterstützung mit seinem Wissen als Rechtsanwalt, seinem Marketing und Social-Media-Bereich, seinem Netzwerk bzw. seiner allgemeinen Bekanntheit.<br><br>Bei einem persönlichen Treffen zwischen Florian Pronold und unserer Vorstandschaft durften wir uns von dem künftigen Schirmherrn ein Bild machen. Florian Pronold ist bzgl. unseres Vereins absolut unparteiisch und lässt Politik und daraus resultierendes Eigeninteresse außen vor und überraschte uns mit seinem breiten Netzwerk an Bekannten und Freunden, welche dem Verein bei künftigen Veranstaltungen zur Seite stehen können.<br><br>Es freut uns immer wieder, wenn wir Leute mit unseren Ideen und Projekten begeistern können und unsere Bekanntheit von Woche zu Woche wächst. Gemeinsam können wir etwas bewirken – Weil “Nix” wird eh scho z’oft do! –<br><br>Enrico Koch",
    image: "/news/webseite.jpg",
    author: "Enrico Koch",
    keywords: [
      "prominent",
      "schirmherr",
      "florian",
      "pronold",
      "gemeinnützig",
      "schirm",
    ],
  },
];

export const ConvertDate = (date: Date) => Intl.DateTimeFormat().format(date);

export const NewsItemLink = (item: NewsItem) => `/neues/${item["slug"]}`;
