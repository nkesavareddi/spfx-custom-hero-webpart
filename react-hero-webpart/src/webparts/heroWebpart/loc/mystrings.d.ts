declare interface IHeroWebpartWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  SiteUrlFieldLabel: string;
  ListFieldLabel: string;
  WebPartConfigButtonLabel: string;
  WebpartConfigDescription: string;
  WebpartConfigIconText: string;
}

declare module 'HeroWebpartWebPartStrings' {
  const strings: IHeroWebpartWebPartStrings;
  export = strings;
}