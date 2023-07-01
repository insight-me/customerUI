import { LibraryActionsTabGroup } from '../../app/shared/enums/library.type';

export const ACTIONS_FOR_DRAFT_TEST = [LibraryActionsTabGroup.Copy, LibraryActionsTabGroup.Delete];
export const ACTIONS_COPY = [LibraryActionsTabGroup.Copy];
export const ACTIONS_FOR_ONGOING_TEST = [LibraryActionsTabGroup.Stop, LibraryActionsTabGroup.Copy];
export const ACTIONS_FOR_BIC_TABLET = [
  LibraryActionsTabGroup.Copy,
  LibraryActionsTabGroup.View,
  LibraryActionsTabGroup.ExportPDF,
  LibraryActionsTabGroup.ExportExcel,
  LibraryActionsTabGroup.ExportCalcData,
];
export const ACTIONS_FOR_BT_TABLET = [
  LibraryActionsTabGroup.Copy,
  LibraryActionsTabGroup.View,
  LibraryActionsTabGroup.ExportExcel,
  // LibraryActionsTabGroup.ExportPDF
];
export const ACTIONS_FOR_ONGOING_TEST_TABLET = [
  // LibraryActionsTabGroup.Stop,
  LibraryActionsTabGroup.Copy,
  LibraryActionsTabGroup.View,
];
export const ACTIONS_FOR_REPORT = [
  LibraryActionsTabGroup.ExportPDF,
  LibraryActionsTabGroup.ExportExcel,
  LibraryActionsTabGroup.ExportCalcData,
];
export const ACTIONS_FOR_REPORT_BT = [
  LibraryActionsTabGroup.ExportExcel,
  // LibraryActionsTabGroup.ExportPDF
];
export const TAB_GROUP_ACTIONS = [
  {
    name: LibraryActionsTabGroup.Stop,
    icon: '',
    label: 'Stop test',
  },
  {
    name: LibraryActionsTabGroup.Copy,
    icon: '../../../assets/images/svg/copy-gray.svg',
    label: 'Copy test',
  },
  {
    name: LibraryActionsTabGroup.Delete,
    icon: '../../../../../assets/images/png/delete.png',
    label: 'Delete test',
  },
  {
    name: LibraryActionsTabGroup.View,
    icon: '../../../assets/images/png/view.png',
    label: 'View report',
  },
  {
    name: LibraryActionsTabGroup.ExportPDF,
    icon: '../../../../../assets/images/svg/pdf.svg',
    label: 'Download Report as .pdf',
  },
  {
    name: LibraryActionsTabGroup.ExportExcel,
    icon: '../../../assets/images/svg/xlsx.svg',
    label: 'Raw data',
  },
  {
    name: LibraryActionsTabGroup.ExportCalcData,
    icon: '../../../assets/images/svg/ic_calculated-data.svg',
    label: 'Calculated data',
  },
];

export const ACTIONS_OBJ = {
  actionsForDraftTest: ACTIONS_FOR_DRAFT_TEST,
  actionsForReport: ACTIONS_FOR_REPORT,
  actionsForReportBT: ACTIONS_FOR_REPORT_BT,
  actionsForBICTablet: ACTIONS_FOR_BIC_TABLET,
  actionsForBTTablet: ACTIONS_FOR_BT_TABLET,
  actionsForOngoingTablet: ACTIONS_FOR_ONGOING_TEST_TABLET,
  actionsCopy: ACTIONS_COPY,
};
