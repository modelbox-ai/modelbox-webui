import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

interface i18nKeyInterface {
  id: string;
  defaultValue?: any;
  zh_CN?: any; // 中文
  en_US?: any; // 英文
  de_DE?: any; // 德语
  es_US?: any; // 西班牙语（美国）
  es_ES?: any; // 西班牙语
  fr_FR?: any; // 法语
  pt_BR?: any; // 葡萄牙语（巴西）
}

@Injectable()
export class I18nService {
  // eslint-disable-next-line
  constructor(private translate: TranslateService) {}
  get(i18nKey: i18nKeyInterface, param?: object): any {
    const { defaultValue, id, zh_CN } = i18nKey;
    let value = defaultValue || zh_CN || id;
    if (value !== id && param && Object.keys(param).length > 0) {
      Object.keys(param).forEach(_key => {
        let reg = new RegExp('{{ *' + _key + ' *}}');
        value = value.replace(reg, param[_key]);
      });
    }
    const i18nValue = this.translate.instant(id, param || {});
    return i18nValue === id ? value : i18nValue;
  }
  getById(id: string): any {
    return this.translate.instant(id);
  }
}
