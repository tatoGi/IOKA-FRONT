import CaseListPage from "@/components/content/cases/List";
import CaseDetailPage from "@/components/content/cases/Detail";
import ClientsListPage from "@/components/content/clients/List";
import FaqListPage from "@/components/content/faq/List";
import GeneralListPage from "@/components/content/general_list/List";
import GeneralDetailPage from "@/components/content/general_detail/Detail";
import HomePage from "@/components/content/home/List";
import NewsAndPublicationListPage from "@/components/content/news_and_publications/List";
import NewsAndPublicationDetailPage from "@/components/content/news_and_publications/Detail";
import PublicationListPage from "@/components/content/publication/List";
import PublicationDetailPage from "@/components/content/publication/Detail";
import OfficesListPage from "@/components/content/offices/List";
import ProjectsListPage from "@/components/content/projects/List";
import ProjectsDetailPage from "@/components/content/projects/Detail";
import ServicesListPage from "@/components/content/services/List";
import ServicesDetailPage from "@/components/content/services/Detail";
import SubmenuListPage from "@/components/content/submenu/List";
import TeamListPage from "@/components/content/team/List";
import SearchListPage from "@/components/content/search/List";
import TeamDetailPage from "@/components/content/team/Detail";
import TextDetailPage from "@/components/content/text/Detail";
import VacanciesListPage from "@/components/content/vacancies/List";
import VacanciesDetailPage from "@/components/content/vacancies/Detail";
import ResultsPage from "@/components/content/results/List";
import SeeAllPage from "@/components/content/see-all/List";
import ContactPage from "@/components/content/contact/contact";
import AboutPage from "@/components/content/about/about";

const pageComponents = [
  { typeName: "home", listPage: HomePage },
  { typeName: "cases", detailPage: CaseDetailPage, listPage: CaseListPage },
  {
    typeName: "clients",
    detailPage: GeneralDetailPage,
    listPage: ClientsListPage
  },
  { typeName: "faq", detailPage: GeneralDetailPage, listPage: FaqListPage },
  {
    typeName: "general_detail",
    detailPage: GeneralDetailPage,
    listPage: GeneralListPage
  },
  {
    typeName: "general_list",
    detailPage: GeneralDetailPage,
    listPage: GeneralListPage
  },
  {
    typeName: "general_detail",
    detailPage: GeneralDetailPage,
    listPage: GeneralListPage
  },
  {
    typeName: "news_and_publications",
    detailPage: NewsAndPublicationDetailPage,
    listPage: NewsAndPublicationListPage
  },
  {
    typeName: "offices",
    detailPage: GeneralDetailPage,
    listPage: OfficesListPage
  },
  {
    typeName: "projects",
    detailPage: ProjectsDetailPage,
    listPage: ProjectsListPage
  },
  {
    typeName: "publication",
    detailPage: PublicationDetailPage,
    listPage: PublicationListPage
  },
  {
    typeName: "services",
    detailPage: ServicesDetailPage,
    listPage: ServicesListPage
  },
  {
    typeName: "submenu",
    detailPage: GeneralDetailPage,
    listPage: SubmenuListPage
  },
  { typeName: "search", detailPage: SearchListPage, listPage: SearchListPage },
  { typeName: "results", detailPage: ResultsPage, listPage: ResultsPage },
  { typeName: "team", detailPage: TeamDetailPage, listPage: TeamListPage },
  { typeName: "text", detailPage: TextDetailPage, listPage: GeneralListPage },
  {
    typeName: "vacancies",
    detailPage: VacanciesDetailPage,
    listPage: VacanciesListPage
  },
  { typeName: "see-all", detailPage: SeeAllPage, listPage: SeeAllPage },
  { typeName: "contact", detailPage: ContactPage },
  { typeName: "about", detailPage: AboutPage }
];

function getPageSections(typeName, isDetail) {
  // console.log(isDetail, 'isDetail')
  // console.log(typeName, 'typeName')

  if (isDetail === undefined) isDetail = true;
  const pageComponent = pageComponents.find(
    (item) => item.typeName === typeName
  );
  if (pageComponent) {
    const { listPage, detailPage } = pageComponent;
    const SelectedComponent = isDetail ? detailPage || listPage : listPage;
    return (props) => <SelectedComponent {...props} />;
  }
  return (props) => <HomePage {...props} />;
}

export default getPageSections;
