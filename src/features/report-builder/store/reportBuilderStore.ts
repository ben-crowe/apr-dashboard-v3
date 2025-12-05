import { create } from 'zustand';
import { ReportBuilderState, ReportSection } from '../types/reportBuilder.types';
import { generateReportHtml } from '../templates/reportHtmlTemplate';

const getMockData = (): ReportSection[] => [
  {
    id: 'cover',
    name: 'Cover Page',
    shortName: 'COVER',
    fields: [
      {
        id: 'cover-photo',
        label: 'Cover Photo',
        type: 'image',
        value: [],
        isEditable: true,
        inputType: 'user-input',
      },
      {
        id: 'property-type-display',
        label: 'Property Type',
        type: 'text',
        value: 'Multi-Family Walkup',
        isEditable: true,
        inputType: 'auto-filled',
      },
      {
        id: 'property-name',
        label: 'Property Name',
        type: 'text',
        value: 'North Battleford Apartments',
        isEditable: true,
        inputType: 'auto-filled',
      },
      {
        id: 'street-address',
        label: 'Street Address',
        type: 'text',
        value: '1101, 1121 109 St',
        isEditable: true,
        inputType: 'auto-filled',
      },
      {
        id: 'city',
        label: 'City',
        type: 'text',
        value: 'North Battleford',
        isEditable: true,
        inputType: 'auto-filled',
      },
      {
        id: 'province',
        label: 'Province',
        type: 'text',
        value: 'Saskatchewan',
        isEditable: true,
        inputType: 'auto-filled',
      },
      {
        id: 'valuation-date',
        label: 'Date of Valuation',
        type: 'date',
        value: '',
        isEditable: true,
        inputType: 'user-input',
      },
      {
        id: 'report-date',
        label: 'Date of Report',
        type: 'date',
        value: new Date().toLocaleDateString('en-CA'),
        isEditable: true,
        inputType: 'auto-filled',
      },
      {
        id: 'file-number',
        label: 'File No',
        type: 'text',
        value: '',
        isEditable: true,
        inputType: 'auto-filled',
      },
    ],
    subsections: [
      {
        id: 'client-info',
        title: 'PREPARED FOR',
        fields: [
          {
            id: 'client-contact-name',
            label: 'Client Contact',
            type: 'text',
            value: '',
            isEditable: true,
            inputType: 'user-input',
          },
          {
            id: 'client-company',
            label: 'Client Company',
            type: 'text',
