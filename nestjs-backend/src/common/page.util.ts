export const PAGE = 'page';
export const FIRST_PAGE = 1;

export function pageInitialize(page: number) {
  if (page == null || page <= 0) {
    page = FIRST_PAGE;
  }
  return page;
}

export function getOffset(page: number, pageSize: number) {
  return (page - 1) * pageSize;
}
