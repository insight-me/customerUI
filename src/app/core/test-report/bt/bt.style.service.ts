import { Injectable } from '@angular/core';
import { InlineStyleModel } from '../../../shared/models/inline.style.model';

@Injectable()
export class BtStyleService {
  /*Common styles*/
  public content: InlineStyleModel = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    flexGrow: 1,
    height: '100%',
  };

  public overlayPanel: InlineStyleModel = {
    width: '400px',
    border: '1px solid #FF9859',
    maxHeight: '310px',
    overflow: 'auto',
  };

  public doubleOverlayPanel: InlineStyleModel = {
    width: '870px',
    border: '1px solid #FF9859',
    //maxHeight: '310px',
    //overflow: 'auto'
    maxWidth: '90vw',
  };

  public brandFunnelRow: InlineStyleModel = {
    display: 'grid',
    'grid-auto-flow': 'column',
    'grid-template-columns': 'repeat(5, auto)',
    gap: '12px'
  }

  public row: InlineStyleModel = {
    display: 'flex',
    //alignItems: 'stretch',
    marginBottom: '20px',
  };

  public box: InlineStyleModel = {
    display: 'grid',
    // 'grid-template-columns': '30% 30%',
    'grid-template-columns': '100px minmax(10%, 100%)',
    alignItems: 'center',
    justifyContent: 'flex-start',
    'text-align': 'center',
    padding: '10px',
    gap: '20px',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '16px',
    'margin-right': '10px'
  };


  // public box: InlineStyleModel = {
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   'text-align': 'center',
  //   padding: '10px',
  //   gap: '20px',
  //   'font-family': 'GT Walsheim Pro Medium',
  //   'font-size': '16px',
  // };

  public name: InlineStyleModel = {
    // width: 'calc(100% - 120px)',
  };

  public svgWrapper: InlineStyleModel = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '16px',
    //'line-height': '150%',
    'text-align': 'center',
    position: 'relative',
    'flex-direction': 'column',
  };

  public svgContentWrapper: InlineStyleModel = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '24px',
    'line-height': '150%',
    'text-align': 'center',
    position: 'relative',
  };

  public svgLabel: InlineStyleModel = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  };

  public imageStyle: InlineStyleModel = {
    width: '100px',
    height: '100px',
    'object-fit': 'contain',
    border: '1px solid #E9ECEF',
    'border-radius': '5px',
  };

  public subTitle: InlineStyleModel = {
    padding: '4px',
    'font-size': '12px',
    'font-family': 'GT Walsheim Pro Regular',
    color: '#8E8E93',
    'white-space': 'nowrap',
    'text-align': 'center',
  };

  public footer: InlineStyleModel = {
    'border-top': '1px solid #E9E9E9',
    paddingTop: '20px',
  };

  public footerInfo: InlineStyleModel = {
    //width: '50%',
    padding: '12px',
    background: '#E3F2FD',
    'border-radius': '8px',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '16px',
    'line-height': '150%',
    alignSelf: 'flex-start',
    marginBottom: '20px',
  };

  public footerLegend: InlineStyleModel = {
    //width: '50%',
    paddingLeft: '40px',
  };

  public legendLabel: InlineStyleModel = {
    position: 'absolute',
    padding: '10px',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '18px',
  };

  public chartBars: InlineStyleModel = {
    width: '100%',
    height: '100%',
    display: 'flex',
    'justify-content': 'space-between',
    'align-items': 'center',
    'flex-wrap': 'nowrap',
    paddingLeft: '40px',
  };

  public simpleChartBars: InlineStyleModel = {
    //width: '100%',
    height: '100%',
    display: 'flex',
    'align-items': 'flex-end',
    'flex-wrap': 'nowrap',
    paddingLeft: '40px',
  };

  public chartBarsDataSetGroup: InlineStyleModel = {
    display: 'flex',
    'align-items': 'flex-end',
    'flex-grow': 1,
    height: '100%',
    margin: '0 auto',
    position: 'relative',
    padding: '0 15px',
  };

  public chartBar: InlineStyleModel = {
    'flex-grow': 1,
    'max-width': '35px',
    'border-radius': '35px 35px 0 0',
    margin: '0 2px',
    'min-width': '35px',
    position: 'relative',
    cursor: 'pointer',
  };

  public simpleChartBar: InlineStyleModel = {
    'flex-grow': 1,
    'max-width': '35px',
    'border-radius': '5px 5px 0 0',
    margin: '0 auto',
    'min-width': '35px',
    position: 'relative',
    cursor: 'pointer',
  };

  public groupLabel: InlineStyleModel = {
    position: 'absolute',
    top: '100%',
    color: '#000',
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '14px',
    'letter-spacing': '0.5px',
    'line-height': '21px',
    'word-break': 'normal',
    width: '100%',
    'max-width': '110px',
    'text-align': 'center',
    paddingTop: '10px',
  };

  public barLabel: InlineStyleModel = {
    position: 'absolute',
    //color: '#8E8E93',
    'font-family': 'GT Walsheim Pro Regular',
    'font-size': '12px',

    top: '100%',
    paddingTop: '7px',
    width: '70px',
    'text-align': 'center',
    left: '-50%',
    'white-space': 'nowrap',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',
  };

  public verticalBarLabel: InlineStyleModel = {
    position: 'absolute',
    //color: '#8E8E93',
    'font-family': 'GT Walsheim Pro Regular',
    'font-size': '12px',
    'white-space': 'nowrap',
    overflow: 'hidden',
    'text-overflow': 'ellipsis',

    bottom: '-120px',
    left: '20%',
    transform: 'rotate(-90deg)',
    'transform-origin': '0 0',
    width: '75px',
    height: '35px',
    'text-align': 'right',
  };

  public subAxis: InlineStyleModel = {
    position: 'absolute',
    'border-bottom': '1px solid #F5F5F5',
    width: '100%',
    'min-width': '800px',
  };

  public verticalSubAxis: InlineStyleModel = {
    position: 'absolute',
    'border-left': '1px solid #E9E9E9',
    height: 'calc(100% + 10px)',
    width: '20px',
  };

  public verticalSubAxisLabel: InlineStyleModel = {
    color: '#8e8e93',
    'font-family': 'GT Walsheim Pro Regular',
    'font-size': '14px',
    'letter-spacing': '0.5px',
    'line-height': '12px',
    position: 'absolute',
    bottom: '-15px',
    left: '-50%',
    'word-break': 'normal',
  };

  public simpleSubAxis: InlineStyleModel = {
    position: 'absolute',
    'border-bottom': '1px solid #F5F5F5',
    //'width': '100%',
  };

  public subAxisLabel: InlineStyleModel = {
    color: '#8e8e93',
    'font-family': 'GT Walsheim Pro Regular',
    'font-size': '14px',
    'letter-spacing': '0.5px',
    'line-height': '12px',
    position: 'absolute',
    bottom: '8px',
  };

  public legend: InlineStyleModel = {
    'font-size': '14px',
    'letter-spacing': '0',
    margin: '30px',
    display: 'flex',
    'align-items': 'center',
    'font-family': 'GT Walsheim Pro Medium',
    'line-height': '150%',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  public legendItem: InlineStyleModel = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px 16px',
  };

  public icon: InlineStyleModel = {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    marginRight: '8px',
  };

  public chartTitle: InlineStyleModel = {
    'font-family': 'GT Walsheim Pro Medium',
    'font-size': '18px',
    'line-height': '150%',
    'text-align': 'center',
    color: '#000000',
    padding: '20px 0 10px',
  };

  public simpleRowElement: InlineStyleModel = {
    //width:
  };
}
