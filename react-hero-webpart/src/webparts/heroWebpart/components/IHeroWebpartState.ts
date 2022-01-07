export interface IHeroState {
  isLoading: Boolean,
  items: any[];
  itemsPaginated: any[];
  currentPage: number;
  totalPages: number;
  pageLimit: number;
  galleryImages: any[];
}