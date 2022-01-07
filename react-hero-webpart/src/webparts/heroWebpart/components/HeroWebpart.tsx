import * as React from 'react';
import styles from './HeroWebpart.module.scss';
import { IHeroWebpartProps } from './IHeroWebpartProps';
import {IHeroState} from './IHeroWebpartState';
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
import Hero from './HeroLayoutNew';
import { sp } from '@pnp/sp';
import { Stack, IStackProps, IStackTokens } from 'office-ui-fabric-react/lib/Stack';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import * as strings from 'HeroWebpartWebPartStrings';
import spservices from '../services/spservices';
import { DisplayMode } from '@microsoft/sp-core-library';

const stackTokens: IStackTokens = { childrenGap: 20 };

const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' };

const tokens = {
  sectionStack: {
    childrenGap: 10,
  },
  spinnerStack: {
    childrenGap: 20,
  },
};

export default class HeroWebpart extends React.Component<IHeroWebpartProps, IHeroState> {
  private spService: spservices = null;
  constructor(props: IHeroWebpartProps) {
    super(props);
    this.spService = new spservices(this.props.spfxContext);
    sp.setup({
      spfxContext: this.props.spfxContext
    });
    this.state = {
      isLoading: false,
      items: this.props.items || [],
      itemsPaginated: this.props.items.length>0?this.props.items.slice(0,5):[],
      currentPage: 1,
      totalPages: this.props.items.length>0?Math.ceil(this.props.items.length / 5):1,
      pageLimit: this.props.pageLimit,
      galleryImages: [],
    };
    this._getItems();
  }

  private async loadPictures() {
    const tenantUrl = `https://${location.host}`;
    let galleryImages: any[] = [];
    try {
      this.setState({isLoading: true});
      const images = await this.spService.getImages(this.props.siteUrl, this.props.list, 5);
      for (const image of images) {
        if (image.FileSystemObjectType == 1) continue; // by pass folder item
				const pURL = `${tenantUrl}/_api/v2.0/sharePoint:${image.File.ServerRelativeUrl}:/driveItem/thumbnails/0/large/content?preferNoRedirect=true `;
				const thumbnailUrl = `${tenantUrl}/_api/v2.0/sharePoint:${image.File.ServerRelativeUrl}:/driveItem/thumbnails/0/c240x240/content?preferNoRedirect=true `;

				let mediaType: string = '';
				switch (image.File_x0020_Type) {
					case 'jpg':
					case 'jpeg':
					case 'png':
					case 'tiff':
					case 'gif':
						mediaType = 'image';
						break;
					case 'mp4':
						mediaType = 'video';
						break;
					default:
						continue;
						break;
				}

				galleryImages.push(
					{
						imageUrl: pURL,
						mediaType: mediaType,
						serverRelativeUrl: image.File.ServerRelativeUrl,
						caption: image.Title ? image.Title : image.File.Name,
						description: image.Description ? image.Description : '',
						linkUrl: image.URL,
            title: '',
					},
				);
      }
      console.log(galleryImages);
      this.setState({ galleryImages: galleryImages, itemsPaginated: galleryImages.slice(0,5), items: galleryImages.slice(0,5), isLoading: false});
    } catch(error) {

    }
  }

  public async componentDidMount() {
		await this.loadPictures();
	}

  private _getItems(){
    let empty=[];
    if(this.state.items.length>0){
    this.setState({itemsPaginated:this.state.items.slice(0,5)}),this.setState({totalPages:Math.ceil(this.state.items.length / 5)});
    }else{
    empty=this.emptyHeroItem();this.setState({items:empty}),this.setState({itemsPaginated:empty});
    }
  }

  private _getPage(page: number){
    this.setState({currentPage: page});
    var itemsSlice:any[], totalPages:number;
    itemsSlice = this.state.items.slice((page - 1) * this.state.pageLimit, ((page - 1) * this.state.pageLimit) + this.state.pageLimit);
    itemsSlice.length==0 ? this.setState({itemsPaginated: this.emptyHeroItem()}) : this.setState({itemsPaginated: itemsSlice},this.render);
  }

  private emptyHeroItem(){
    var b=[];
      for (let i = 0; i < this.state.pageLimit; i++) {
        b.push({
          Title: "Coming soon!",
          description: "We don't have anything here yet, we're always open to suggestions!",
          Hyperlink:"",
          filePicker:[{fileAbsoluteUrl:require('../assets/blankEntry154873.jpg'),fileName:'blankEntry154873.jpg',fileNameWithoutExtension:'blankEntry154873'}]
        });
      }
    return b;
  }

  public componentDidUpdate(prevProps : IHeroWebpartProps, prevState : IHeroState) : void 
  {
      // If properties have changed bind it and update webpart
      if(this.props.items !== prevProps.items && this.props.items.length!==0)
      {
        this.setState({items:this.props.items});
        if(this.props.showAllHero){
          this._getPage(this.state.currentPage);
        }
      }
  }

  private onConfigure() {
    // Context of the web part
    this.props.spfxContext.propertyPane.open();
  }

  public render(): React.ReactElement<IHeroWebpartProps> {
    console.log("list", this.props.list);
    if(!this.props.list) {
      return <Placeholder iconName='Edit'
        iconText={strings.WebpartConfigIconText}
        description={strings.WebpartConfigDescription}
        buttonLabel={strings.WebPartConfigButtonLabel}
        hideButton={this.props.displayMode === DisplayMode.Read}
        onConfigure={this.onConfigure.bind(this)} />
    }

    if(this.state.items.length<=0){
      this._getItems();
      return(
        <Stack {...rowProps} tokens={tokens.spinnerStack}>
          <Label>Loading</Label>
          <Spinner size={SpinnerSize.large} />
        </Stack>
      );
    }else{
    var itemList:any[];
    this.props.showAllHero ? itemList = this.state.itemsPaginated : itemList = this.state.items;   
    }

    if(this.state.isLoading) {
      return <Spinner size={SpinnerSize.large} label='loading images...' />
    }
    return (
      <div className={styles.heroWebpart}>
       <div className={styles.titleHead}>
         {this.props.title}
       </div>
       <Hero items={this.props.showAllHero ? this.state.itemsPaginated : this.state.items.slice(0, 5)}/>
         {this.props.showAllHero ? 
         <Pagination
           currentPage={this.state.currentPage}
           totalPages={this.state.totalPages} 
           onChange={(page) => this._getPage(page)}
           limiter={5} // Optional - default value 3
           hideFirstPageJump={this.props.hideFirstPageJump} // Optional
           hideLastPageJump={this.props.hideLastPageJump} // Optional
           limiterIcon={"Emoji12"} // Optional
           /> : "" }
          </div>
    );
  }
}