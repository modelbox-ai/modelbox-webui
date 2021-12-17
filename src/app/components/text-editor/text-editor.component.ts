/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  Component,
  Input,
  ViewChild,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { AceComponent } from 'ngx-ace-wrapper';
import { debounce } from 'lodash';
import 'brace';
import ace from 'brace'
import 'brace/mode/dot';
import 'brace/theme/tomorrow';
import { BasicServiceService } from '@shared/services/basic-service.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.less'],
})
export class TextEditorComponent {
  @Input() dotSrc: any;
  @Input() onTextChange: any;
  @Input() onFocus: any;
  @Input() onBlur: any;
  @Input() error: any;
  @Input() selectedGraphComponents: any = [];
  @Input() holdOff: any;
  @Input() fontSize: any;
  @Input() registerUndo: any;
  @Input() registerRedo: any;
  @Input() registerUndoReset: any;
  @Input() registerResize: any;
  @Input() registerSwitchDirectionButtonClick: any
  @ViewChild(AceComponent, { static: true }) componentRef: AceComponent;
  prevError: any;
  prevNumLines: number;
  scrollbarWidth = 0;
  editor: any;
  config: any = {};
  Range = ace.acequire("ace/range").Range;
  handleChange = debounce((value, event?) => {
    if (!this.editor) return;
    const hasUndo = this.editor.getSession().getUndoManager().hasUndo();
    const hasRedo = this.editor.getSession().getUndoManager().hasRedo();
    const undoRedoState = { hasUndo, hasRedo };
    if (this.onTextChange !== undefined) {
      this.onTextChange(value, undoRedoState);
    }
  }, 500);

  constructor(private div: ElementRef, private basicService: BasicServiceService) { }

  ngOnInit() {
    let self = this
    this.basicService.subscribe({
      next: value => {
        let temp = self.dotSrc.match(/[\n|}]\s*rankdir\s*=.*;*([\n|}])/);
        self.dotSrc = self.dotSrc.replace(/[\n|}]\s*rankdir\s*=.*;*([\n|}])/gi, '$1');
        if (temp !== null && temp.length > 0) {
          let rankdir = "LR";
          if (temp[0].indexOf("LR") !== -1) {
            rankdir = "VERTICLE";
          }
          self.dotSrc = self.dotSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 $3{\n    rankdir=' + rankdir);
        } else {
          self.dotSrc = self.dotSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 $3{\n    rankdir=' + "LR");
        }
      },
      error: err => {
        // handle err
      },
      complete: () => {
        // handle complete
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { error } = changes;
    if (error && !error.firstChange) {
      let annotations = null;
      if (error.currentValue) {
        annotations = [
          {
            row: this.error.line - 1,
            column: 0,
            text: this.error.message,
            type: 'error',
            dummy: Date.now(),
          },
        ];
        this.editor.getSession().setAnnotations(annotations || []);
        if (this.editor && !this.editor.isRowFullyVisible(this.error.line)) {
          if (
            !this.prevError ||
            this.error.message !== this.prevError.message ||
            (this.error.line !== this.prevError.line &&
              this.error.numLines - this.error.line !==
              this.prevNumLines - this.prevError.line)
          ) {
            this.editor.scrollToLine(this.error.line - 1, true);
          }
        }
        this.prevNumLines = this.error.numLines;
      } else {
        this.editor.getSession().setAnnotations([]);
      }
      this.prevError = this.error;
      const locations = this.selectedGraphComponents.reduce(
        (locations, component) => locations.concat(component.locations),
        []
      );
      const markers = locations.map(location => ({
        startRow: location.start.line - 1,
        startCol: location.start.column - 1,
        endRow: location.end.line - 1,
        endCol: location.end.column - 1,
        style: {
          position: 'absolute',
          background: 'rgb(250, 250, 255)',
          border: '1px solid rgb(200, 200, 250)',
        },
        type: 'background',
      }));
      if (this.div.nativeElement) {
        const scrollbarDiv = this.div.nativeElement.querySelector(
          'div.ace_scrollbar-v'
        );
        const hasScrollbar =
          scrollbarDiv && scrollbarDiv.style['display'] !== 'none';
        if (hasScrollbar) {
          const scrollbarInnerDiv = scrollbarDiv.querySelector(
            'div.ace_scrollbar-inner'
          );
          this.scrollbarWidth = scrollbarInnerDiv.clientWidth - 5;
        }
      }
    }
  }

  public handleMarkers(markers: any[]) {
    // remove foreground markers
    let currentMarkers = this.editor.getSession().getMarkers(true);
    for (const i in currentMarkers) {
      this.editor.getSession().removeMarker(currentMarkers[i].id);
    }
    // remove background markers except active line marker and selected word marker
    currentMarkers = this.editor.getSession().getMarkers(false);
    for (const i in currentMarkers) {
      this.editor.getSession().removeMarker(currentMarkers[i].id);
    }

    for (const i in markers) {
      let m = markers[i];
      let add = new this.Range(m.startRow, m.startCol, m.endRow, m.endCol);
      this.editor.getSession().addMarker(add, "warning", "text", false);
    }
  }

  ngAfterViewInit(): void {
    this.editor = this.componentRef.directiveRef.ace();
    this.editor.container.style.lineHeight = 1.8;
    this.editor.setOptions({
      fontSize: "14px"
    });
    this.registerUndo(this.undo);
    this.registerRedo(this.redo);
    this.registerUndoReset(this.resetUndoStack);
    this.registerResize(this.resize);
    this.registerSwitchDirectionButtonClick(this.switchDirection);
    this.config.tabSize = 2
    this.config.enableBasicAutocompletion = true;
    this.config.enableLiveAutocompletion = true;
    this.config.enableSnippets = true;
    this.config.printMarginColumn = 120;
  }

  resize = () => {
    this.editor.resize();
  }

  undo = () => {
    this.editor.getSession().getUndoManager().undo();
  };

  redo = () => {
    this.editor.getSession().getUndoManager().redo();
  };

  resetUndoStack = () => {
    this.editor.getSession().getUndoManager().reset();
  };

  switchDirection = () => {
    let temp = this.dotSrc.match(/[\n|}]\s*rankdir\s*=.*;*([\n|}])/);
    this.dotSrc = this.dotSrc.replace(/[\n|}]\s*rankdir\s*=.*;*([\n|}])/gi, '$1');
    if (temp !== null) {
      let rankdir = "LR";
      if (temp[0].indexOf("LR") !== -1) {
        rankdir = "VERTICLE";
      }
      this.dotSrc = this.dotSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 $3{\n    rankdir=' + rankdir);
    } else {
      this.dotSrc = this.dotSrc.replace(/(\s*)(digraph|graph)\s(.*){/gi, '$1$2 $3{\n    rankdir=' + "LR");
    }
  };
}
