import * as React from "react";
import { IHeroLayoutProps } from "./IHeroLayoutProps";
import styles from './HeroWebpart.module.scss';

// Used to render list grid
import { List } from 'office-ui-fabric-react/lib/List';
import { IRectangle, ISize } from 'office-ui-fabric-react/lib/Utilities';


export default class Hero extends React.Component<IHeroLayoutProps> {
    

    public render(): React.ReactElement<IHeroLayoutProps> {
      //const classTotal = "itemShow"+this.props.totalShow;
      const items = this.props.items; 
      const viewType = items.length==1 ? "heroOne" : items.length==2 ? "heroTwo" : items.length==3 ? "heroThree" :
      items.length==4 ? "heroFour" : items.length==5 ? "heroFive" : "heroFive";
      var arr = [];
      arr.push(items);

      return (
        <div role="group" className={viewType}>
          <List
            role="presentation"
            className={styles.heroItem}
            items={arr}
            getItemCountForPage={this._getItemCountForPage}
            onRenderCell={this._onRenderHeroItem}
            {...this.props.listProps}
          />
        </div>
      );
    }

    private _getItemCountForPage = (itemIndex: number, surfaceRect: IRectangle): number => {
      return 1;
    }
    
    private _onRenderHeroItem =  (items: any, index: number | undefined): JSX.Element => {
      const thumbRend = "https://media.akamai.odsp.cdn.office.net/uksouth1-mediap.svc.ms/transform/thumbnail?provider=url&inputFormat=jpg&docid=";
      const secondItems = items.slice(1,5);
      const firstItem = items.slice(0,1)[0];
      var firstItemUrl = firstItem.linkUrl ? firstItem.linkUrl : "#";
      var smalltemUrl;
      console.log("items", items);
      return(
        <div className={styles.heroItem}>
          <div className={styles["flexcontainer"]}>
            <div className={styles.focusItem}>
               <div className={styles["flexitems"]}>
                  <a href={firstItemUrl}>
                  <img src={firstItem.imageUrl}/>
                  <div className={styles.heroTitle}>{firstItem.title}</div>
                  <div className={styles.description}><div className={styles.heroTitleHover}>{firstItem.title}</div><div className={styles.info}>{firstItem.description ? firstItem.description.length>150 ? firstItem.description.substring(0, 150)+".." : firstItem.description : "Description coming soon"}</div></div>
                  </a>
              </div>
            </div>
          </div>
          <div className={styles["flexcontainer"]}>
                {secondItems.map((item) => (
                  smalltemUrl= item.linkUrl ? item.linkUrl : "#",
                  <div className={styles["flexitems"]}>
                        <a href={smalltemUrl}>
                        <img src={item.imageUrl}/>
                        <div className={styles.heroTitle}>{item.title}</div>
                        <div className={styles.description}><div className={styles.heroTitleHover}>{item.title}</div><div className={styles.info}>{item.description ? item.description.length>150 ? item.description.substring(0, 150)+".." : item.description : "Description coming soon"}</div></div>
                        </a>
                  </div>
                ))}
          </div>
        </div>
      );
    }
}