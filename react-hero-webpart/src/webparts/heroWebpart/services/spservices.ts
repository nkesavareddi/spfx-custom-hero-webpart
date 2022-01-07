import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class spservices {
  constructor(private context: WebPartContext) {
    // Setuo Context to PnPjs and MSGraph
    sp.setup({
      spfxContext: this.context,
    });
  }

  public async getSiteLists(siteUrl: string) {

    let results: any[] = [];

    if (!siteUrl) {
      return [];
    }

    try {
      const web = Web(siteUrl);
      results = await web.lists
        .select("Title", "ID")
        .filter('BaseTemplate eq 109')
        .usingCaching()
        .get();

    } catch (error) {
      return Promise.reject(error);
    }
    return results;
  }

  public async getImages(
    siteUrl: string,
    listId: string,
    numberImages: number
  ): Promise<any[]> {
    let results: any[] = [];
    try {
      const web = Web(siteUrl);
      // sp.web.get.
      results = await web.lists
        .getById(listId)
        .items.select(
          "Title",
          "Description",
          "URL",
          "File_x0020_Type",
          "FileSystemObjectType",
          "File/Name",
          "File/ServerRelativeUrl",
          "File/Title",
          "File/Id",
          "File/TimeLastModified"
        )
        .top(numberImages)
        .expand("File")
        .filter(
          `File_x0020_Type eq 'jpg' or File_x0020_Type eq 'png' or File_x0020_Type eq 'jpeg' or File_x0020_Type eq 'gif' or File_x0020_Type eq 'mp4'`
        )
        .orderBy("Priority")
        .usingCaching()
        .get();
    } catch (error) {
      return Promise.reject(error);
    }
    // sort by name

    return results;
  }
}