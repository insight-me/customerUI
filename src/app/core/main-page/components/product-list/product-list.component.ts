import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { PRODUCT_LIST } from '../../../../../assets/consts/main-page.consts';
import { ActivatedRoute } from '@angular/router';
import { SCROLL_DELAY } from '../../../../../assets/consts/consts';

export interface ProductList {
  categoryNumber: string;
  categoryTitle: string;
  categoryDescription: string;
  products: Products[];
}

export interface Products {
  name: string;
  value: string;
}

export interface GridCard {
  title: string;
  description: string;
  custom?: boolean;
  link?: string;
  comingSoon: boolean;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, AfterViewInit {
  public productList: ProductList[] = [
    {
      categoryNumber: '01',
      categoryTitle: 'Market landscape',
      categoryDescription:
        'Should we establish in the market and/or category? Is there a consumer need?',
      products: [
        {
          name: 'PositionMarketModelling',
          value: 'Position & market landscape modelling',
        },
        {
          name: 'BrandDueDiligence',
          value: 'Brand due diligence',
        },
      ],
    },
    {
      categoryNumber: '02',
      categoryTitle: 'Target group choice',
      categoryDescription:
        'Which are the prioritized consumer target groups to attract with the brand and offering?',
      products: [
        {
          name: 'ConsumerSegmentation',
          value: 'Consumer segmentation, driver & barrier analysis',
        },
        {
          name: 'TargetGroupHierarchy',
          value: 'Target Group Hierarchy',
        },
      ],
    },
    {
      categoryNumber: '03',
      categoryTitle: 'Brand strategy',
      categoryDescription:
        'Which brand position should we own to get the biggest impact in our target group?',
      products: [
        {
          name: 'BrandConcept',
          value: 'Brand concept',
        },
      ],
    },
    {
      categoryNumber: '04',
      categoryTitle: 'Product Innovation, Pricing & Visual Identity',
      categoryDescription:
        'Which products, packaging designs and communication ideas will attract the target group? And what are your customers willing to pay for your product or service?',
      products: [
        {
          name: 'ProductInnovation',
          value: 'Product Innovation',
        },
        {
          name: 'PackagingDesign',
          value: 'Packaging Design',
        },
        {
          name: 'CommunicationIdea',
          value: 'Communication Idea',
        },
        {
          name: 'WillingnessToPay',
          value: 'Willingness to pay',
        },
      ],
    },
    {
      categoryNumber: '05',
      categoryTitle: 'Brand & Com. strategy follow up',
      categoryDescription:
        'Do I get any impact on the market and in the target group?',
      products: [
        {
          name: 'BrandTracking',
          value: 'Brand Tracker',
        },
        {
          name: 'CampaignEvaluation',
          value: 'Campaign Evaluation',
        },
      ],
    },
    {
      categoryNumber: '06',
      categoryTitle: 'New market exploration',
      categoryDescription:
        'What other categories and/or markets do we have a brand and business potential in?',
      products: [
        {
          name: 'NewExploration',
          value: 'New market exploration',
        },
      ],
    },
  ];
  public list: GridCard[] = PRODUCT_LIST;

  public customCardDescriptionTexts: string[] = [
    'landing.If the brand is known by the consumer and can convert to purchase and brand preference? I.e. understand what the business and brand potential look like',
    'landing.What the brand stands for and if the brand performs on the most important category drivers? I.e. does the brand stand for something unique or does competition stand for the same attributes?',
    'landing.How well does the brand concept perform in the population and target group? I.e. is a re-position needed or can the brand grow with current position?',
    'landing.What target group(s) the brand attracts? I.e. does the brand attract "the right" target group profile or do we need to increase trial in other groups?',
  ];

  public shownProductList: ProductList[][] = [];
  public columns = 6;

  @HostListener('window:resize', ['$event.target'])
  private resize(ev): void {
    this.changeProductList();
  }

  constructor(private activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.changeProductList();
  }

  public ngAfterViewInit(): void {
    if (this.activatedRoute.snapshot.queryParams?.test) {
      setTimeout(() => this.onNavigateTest(this.activatedRoute.snapshot.queryParams.test), SCROLL_DELAY);
    }
  }

  public onNavigateTest(templateId: string): void {
    const itemToScrollTo = document.getElementById(templateId);
    if (itemToScrollTo) {
      window.scrollTo({
        top: itemToScrollTo.offsetTop,
        behavior: 'smooth',
      });
    }
  }

  private changeProductList(): void {
    const width = window.innerWidth;
    if (width > 1412) {
      this.shownProductList = [this.productList];
      this.columns = 6;
    }
    if (width <= 1422 && width > 965) {
      this.shownProductList = [
        this.productList.slice(0, 4),
        this.productList.slice(-2),
      ];
      this.columns = 4;
    }
    if (width <= 965 && width >= 744) {
      this.shownProductList = [
        this.productList.slice(0, 3),
        this.productList.slice(-3),
      ];
      this.columns = 3;
    }
    if (width < 744) {
      this.shownProductList = [...this.productList.map((item) => [item])];
      this.columns = 1;
    }
  }
}
