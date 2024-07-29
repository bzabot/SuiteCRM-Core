/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from "@angular/core";
import {
  AttributeMap,
  deepClone,
  FieldDefinitionMap,
  isFalse,
  isTrue,
  Record,
  SearchCriteria,
  SearchCriteriaFilter,
  StringMap,
  ViewContext,
} from "common";
import { Observable, of, Subscription } from "rxjs";
import { LanguageStore } from "../../../../store/language/language.store";
import { BaseWidgetComponent } from "../../../widgets/base-widget.model";
import { distinctUntilChanged, filter, map, shareReplay } from "rxjs/operators";
import {
  RecordThreadConfig,
  ThreadItemMetadataConfig,
} from "../../../record-thread/components/record-thread/record-thread.model";
import { RecordThreadItemMetadata } from "../../../record-thread/store/record-thread/record-thread-item.store.model";
import { SystemConfigStore } from "../../../../store/system-config/system-config.store";
import { ModuleNameMapper } from "../../../../services/navigation/module-name-mapper/module-name-mapper.service";
import { end } from "@popperjs/core";

export interface BoardWidgetConfig {
  module: string;
  class?: string;
  maxListHeight?: number;
  direction?: "asc" | "desc";
  item: {
    dynamicClass?: string[];
    itemClass?: string;
    collapsible?: boolean;
    collapseLimit?: number;
    layout?: ThreadItemMetadataConfig;
    fields?: FieldDefinitionMap;
  };
  create: {
    presetFields?: {
      parentValues?: StringMap;
      static?: AttributeMap;
    };
    layout?: ThreadItemMetadataConfig;
  };
  filters?: {
    parentFilters?: StringMap;
    static?: SearchCriteriaFilter;
    orderBy?: string;
    sortOrder?: string;
  };
}

@Component({
  selector: "scrm-board-sidebar-widget",
  templateUrl: "./board-sidebar-widget.component.html",
  styles: [],
})
export class BoardSidebarWidgetComponent
  extends BaseWidgetComponent
  implements OnInit, OnDestroy
{
  panelMode: "collapsible" | "closable" | "none" = "none";

  columns: string[] = [];
  options: WritableSignal<BoardWidgetConfig> = signal(null);
  boardConfig: RecordThreadConfig;

  filters$: Observable<SearchCriteria>;
  presetFields$: Observable<AttributeMap>;
  protected subs: Subscription[] = [];
  protected moduleNameMapper: ModuleNameMapper;
  moduleType: string;
  columnField: string;
  enumOptions: any;
  constructor(
    protected language: LanguageStore,
    protected sytemConfig: SystemConfigStore
  ) {
    super();
    this.moduleNameMapper = inject(ModuleNameMapper);
  }

  ngOnInit(): void {
    // this.columns = [
    //   "Not Started",
    //   "In Progress",
    //   "Completed",
    //   "Pending Input",
    //   "Deferred",
    // ];

    this.options.set(this.config.options.board);
    // this.options = this.config.options.board;

    if (!this.options) {
      return;
    }

    const columnField = this?.context?.record?.attributes.sections_field;
    const moduleType = this?.context?.record?.attributes.module_type;

    if (columnField) {
      this.columnField = columnField.split("_").slice(1).join("_");

      // Get section names
      const doms = {
        sales_stage: "sales_stage_dom",
        status: "task_status_dom",
      };
      this.enumOptions = doms[this.columnField];
      this.columns = Object.keys(
        this.language.getAppListString(this.enumOptions)
      );
    }

    if (moduleType) {
      // Get module type
      this.moduleType = moduleType;
      this.options.update((options) => {
        return {
          ...options,
          module: this.moduleNameMapper.toFrontend(this.moduleType),
        };
      });
    }

    if (this.context$ && this.context$.subscribe()) {
      this.subs.push(
        this.context$.subscribe((context: ViewContext) => {
          this.context = context;

          const columnField = this?.context?.record?.attributes.sections_field;
          const moduleType = this?.context?.record?.attributes.module_type;
          if (columnField) {
            this.columnField = columnField.split("_").slice(1).join("_");
            // Get section names
            const doms = {
              sales_stage: "sales_stage_dom",
              status: "task_status_dom",
            };
            this.enumOptions = doms[this.columnField];
            this.columns = Object.keys(
              this.language.getAppListString(this.enumOptions)
            );
          }

          if (moduleType) {
            // Get module type
            this.moduleType = moduleType;
            this.options.update((options) => {
              return {
                ...options,
                module: this.moduleNameMapper.toFrontend(this.moduleType),
              };
            });
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  getHeaderLabel(): string {
    return this.getLabel(this?.config?.labelKey ?? "") || "";
  }

  getLabel(key: string): string {
    const context = this?.context || ({} as ViewContext);
    const module = context?.module || "";

    return this.language.getFieldLabel(key, module);
  }
}
