// webview.ts
interface Item {
  type: string;
  zIndex: number;
  src?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  data?: string;
  content?: string;
  fontSize?: number;
  color?: string;
}

export class WebViewRenderer {
  parseJsonData(jsonString: string): any {
    return JSON.parse(jsonString);
  }

  sortByZIndex(items: Item[]): Item[] {
    return [...items].sort((a, b) => a.zIndex - b.zIndex);
  }

  renderItem(item: Item): string {
    const style = `position: absolute; z-index: ${item.zIndex}; left: ${item.x}px; top: ${item.y}px;`;
    
    if (item.type === 'image') {
      return `<img src="${item.src}" style="${style} width: ${item.width}px; height: ${item.height}px;" />`;
    }
    
    if (item.type === 'text') {
      const textStyle = `${style} font-size: ${item.fontSize}px; color: ${item.color};`;
      return `<div style="${textStyle}">${item.content}</div>`;
    }
    
    return '';
  }

  renderBarcode(item: Item): string {
    const containerStyle = `position: absolute; right: 0; top: 0; width: 10%; height: 100%; background-color: white; display: flex; align-items: center; justify-content: center; z-index: ${item.zIndex};`;
    const barcodeStyle = `width: ${item.width}px; height: ${item.height}px;`;
    
    return `<div class="barcode-container" style="${containerStyle}">
      <div class="barcode" data-value="${item.data}" style="${barcodeStyle}"></div>
    </div>`;
  }

  generateCompleteHTML(jsonString: string): string {
    const data = this.parseJsonData(jsonString);
    const sortedItems = this.sortByZIndex(data.items);
    
    let contentHTML = '';
    let barcodeHTML = '';
    
    sortedItems.forEach(item => {
      if (item.type === 'barcode') {
        barcodeHTML = this.renderBarcode(item);
      } else {
        contentHTML += this.renderItem(item);
      }
    });
    
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1920, height=158">
    <title>WebView Display</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1920px;
            height: 158px;
            position: relative;
            overflow: hidden;
            background-color: black;
        }
        #container {
            width: 100%;
            height: 100%;
            position: relative;
        }
    </style>
</head>
<body>
    <div id="container">
        ${contentHTML}
        ${barcodeHTML}
    </div>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    <script>
        // 바코드 생성
        const barcodeElements = document.querySelectorAll('.barcode');
        barcodeElements.forEach(element => {
            const value = element.getAttribute('data-value');
            if (value) {
                JsBarcode(element, value, {
                    format: "CODE128",
                    displayValue: true,
                    fontSize: 12,
                    height: 50
                });
            }
        });
    </script>
</body>
</html>`;
  }
}