// webview.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import { WebViewRenderer } from './webview';

describe('WebViewRenderer', () => {
  let renderer: WebViewRenderer;
  
  beforeEach(() => {
    renderer = new WebViewRenderer();
  });

  describe('JSON 파일 읽기', () => {
    it('should read and parse JSON data', () => {
      const mockJsonData = {
        items: []
      };
      
      const result = renderer.parseJsonData(JSON.stringify(mockJsonData));
      expect(result).toEqual(mockJsonData);
    });
  });

  describe('이미지 레이어링', () => {
    it('should sort items by z-index', () => {
      const mockData = {
        items: [
          { type: 'image', zIndex: 2, src: 'data:image/png;base64,test2' },
          { type: 'image', zIndex: 1, src: 'data:image/png;base64,test1' },
          { type: 'image', zIndex: 3, src: 'data:image/png;base64,test3' }
        ]
      };
      
      const sortedItems = renderer.sortByZIndex(mockData.items);
      expect(sortedItems[0].zIndex).toBe(1);
      expect(sortedItems[1].zIndex).toBe(2);
      expect(sortedItems[2].zIndex).toBe(3);
    });
  });

  describe('HTML 렌더링', () => {
    it('should generate HTML for image items', () => {
      const mockData = {
        items: [
          { 
            type: 'image', 
            zIndex: 1, 
            src: 'data:image/png;base64,test1',
            x: 100,
            y: 50,
            width: 200,
            height: 150
          }
        ]
      };
      
      const html = renderer.renderItem(mockData.items[0]);
      expect(html).toContain('position: absolute');
      expect(html).toContain('z-index: 1');
      expect(html).toContain('left: 100px');
      expect(html).toContain('top: 50px');
      expect(html).toContain('width: 200px');
      expect(html).toContain('height: 150px');
    });
  });

  describe('바코드 렌더링', () => {
    it('should generate barcode area when barcode data exists', () => {
      const mockData = {
        items: [
          { 
            type: 'barcode', 
            zIndex: 10,
            data: '1234567890',
            width: 150,
            height: 50
          }
        ]
      };
      
      const html = renderer.renderBarcode(mockData.items[0]);
      expect(html).toContain('position: absolute');
      expect(html).toContain('right: 0');
      expect(html).toContain('width: 10%');
      expect(html).toContain('background-color: white');
      expect(html).toContain('barcode-container');
    });
  });

  describe('전체 HTML 생성', () => {
    it('should generate complete HTML document', () => {
      const mockData = {
        items: [
          { 
            type: 'image', 
            zIndex: 1, 
            src: 'data:image/png;base64,test1',
            x: 0,
            y: 0,
            width: 1920,
            height: 158
          },
          { 
            type: 'text', 
            zIndex: 2,
            content: 'Hello World',
            x: 100,
            y: 50,
            fontSize: 24,
            color: '#ffffff'
          },
          { 
            type: 'barcode', 
            zIndex: 10,
            data: '1234567890',
            width: 150,
            height: 50
          }
        ]
      };
      
      const html = renderer.generateCompleteHTML(JSON.stringify(mockData));
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<meta charset="UTF-8">');
      expect(html).toContain('width=1920, height=158');
      expect(html).toContain('overflow: hidden');
      expect(html).toContain('test1');
      expect(html).toContain('Hello World');
      expect(html).toContain('barcode-container');
    });
  });
});