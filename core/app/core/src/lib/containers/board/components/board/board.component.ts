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

import { Component, OnDestroy, OnInit } from "@angular/core";
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

@Component({
  selector: "scrm-board",
  templateUrl: "./board.component.html",
  styles: [],
})
export class BoardComponent
  extends BaseWidgetComponent
  implements OnInit, OnDestroy
{
  columns: string[] = [];

  options: {
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
  };
  recordThreadConfig: RecordThreadConfig;

  filters$: Observable<SearchCriteria>;
  presetFields$: Observable<AttributeMap>;
  protected subs: Subscription[] = [];

  constructor(
    protected language: LanguageStore,
    protected sytemConfig: SystemConfigStore
  ) {
    super();
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  // }

  ngOnInit(): void {
    this.columns = [
      "Not Started",
      "In Progress",
      "Completed",
      "Pending Input",
      "Deferred",
    ];

    this.options = {
      module: "tasks",
      class: "",
      maxListHeight: 0,
      filters: {
        static: {
          parent_type: {
            field: "parent_type",
            operator: "=",
            values: ["Cases"],
          },
        },
        orderBy: "date_entered",
        sortOrder: "DESC",
      },
      item: {
        itemClass: "case-tasks-item pt-1 pb-1 w-100",
        collapsible: true,
        layout: {
          header: {
            rows: [],
          },
          body: {
            class: "border bg-transparent",
            rows: [
              /*{
                align: "end",
                justify: "between",
                cols: [
                  {
                    field: {
                      name: "author",
                      label: "",
                    },
                    labelDisplay: "none",
                    hideIfEmpty: true,
                    class: "font-weight-bold item-title",
                  },
                  {
                    field: {
                      name: "internal",
                      label: "",
                    },
                    labelDisplay: "inline",
                    labelClass: "m-0",
                    display: "none",
                    hideIfEmpty: true,
                    class: "small ml-auto font-weight-light",
                  },
                ],
              },*/
              {
                align: "start",
                justify: "between",
                class: "flex-grow-1 item-content p-1",
                cols: [
                  {
                    field: {
                      name: "name",
                      label: "LBL_SUBJECT",
                      link: true,
                      fieldDefinition: {
                        name: "name",
                        vname: "LBL_SUBJECT",
                        dbType: "varchar",
                        type: "name",
                        len: "50",
                        unified_search: true,
                        full_text_search: {
                          boost: 3,
                        },
                        importable: "required",
                        required: true,
                      },
                      type: "name",
                    },

                    labelClass: "font-weight-light small mb-0",
                    labelDisplay: "none",
                  },
                  {
                    /*field: {
                      name: "date_due",
                      label: "LBL_DUE_DATE",
                      fieldDefinition: {
                        name: "date_due",
                        vname: "LBL_DUE_DATE",
                        type: "datetime",
                        dbType: "datetime",
                        group: "date_due",
                        studio: {
                          required: true,
                          no_duplicate: true,
                        },
                        enable_range_search: true,
                        options: "date_range_search_dom",
                        required: false,
                        legacyGroup: true,
                        groupFields: {
                          date_due_flag: {
                            name: "date_due_flag",
                            vname: "LBL_DATE_DUE_FLAG",
                            type: "bool",
                            group: "date_due",
                            studio: false,
                            required: false,
                          },
                          date_due: {
                            name: "date_due",
                            vname: "LBL_DUE_DATE",
                            type: "datetimecombo",
                            dbType: "datetime",
                            group: "date_due",
                            studio: {
                              required: true,
                              no_duplicate: true,
                            },
                            enable_range_search: true,
                            options: "date_range_search_dom",
                            required: false,
                          },
                        },
                      },
                      type: "datetime",
                    },*/
                    labelClass: "font-weight-light small mb-0",
                    labelDisplay: "none",
                  },
                  {
                    actionSlot: true,
                    class: "w-25",
                  },
                ],
              },
              {
                align: "start",
                justify: "between",
                class: "flex-grow-1 item-content p-1",
                cols: [
                  {
                    field: {
                      name: "date_due",
                      label: "LBL_DUE_DATE",
                      fieldDefinition: {
                        name: "date_due",
                        vname: "LBL_DUE_DATE",
                        type: "datetime",
                        dbType: "datetime",
                        group: "date_due",
                        studio: {
                          required: true,
                          no_duplicate: true,
                        },
                        enable_range_search: true,
                        options: "date_range_search_dom",
                        required: false,
                        legacyGroup: true,
                        groupFields: {
                          date_due_flag: {
                            name: "date_due_flag",
                            vname: "LBL_DATE_DUE_FLAG",
                            type: "bool",
                            group: "date_due",
                            studio: false,
                            required: false,
                          },
                          date_due: {
                            name: "date_due",
                            vname: "LBL_DUE_DATE",
                            type: "datetimecombo",
                            dbType: "datetime",
                            group: "date_due",
                            studio: {
                              required: true,
                              no_duplicate: true,
                            },
                            enable_range_search: true,
                            options: "date_range_search_dom",
                            required: false,
                          },
                        },
                      },
                      type: "datetime",
                    },
                    labelClass: "font-weight-light small mb-0",
                    labelDisplay: "top",
                    class: "font-weight-light small my-0 ",
                  },
                  {
                    field: {
                      name: "assigned_user_name",
                      label: "LBL_ASSIGNED_USER_NAME",
                      link: false,
                      fieldDefinition: {
                        name: "assigned_user_name",
                        vname: "LBL_ASSIGNED_USER_NAME",
                        rname: "user_name",
                        source: "non-db",
                        dbType: "varchar",
                        type: "relate",
                        len: "100",
                        unified_search: true,
                        full_text_search: {
                          boost: 3,
                        },
                        importable: "required",
                      },
                      type: "relate",
                    },
                    labelClass: "font-weight-light small mb-0",
                    labelDisplay: "none",
                    class: "align-self-end",
                  },
                  // {
                  //   actionSlot: false,
                  //   class: "w-25",
                  // },
                ],
              },
              /*{
                align: "start",
                justify: "between",
                class: "flex-grow-1 item-content p-1",
                cols: [
                  {
                    field: {
                      name: "priority",
                      label: "LBL_PRIORITY",
                      link: false,
                      fieldDefinition: {
                        name: "priority",
                        vname: "LBL_PRIORITY",
                        options: "task_priority_dom",
                        type: "enum",
                        len: "100",
                        unified_search: true,
                        full_text_search: {
                          boost: 3,
                        },
                        importable: "required",
                        required: true,
                      },
                      type: "enum",
                    },

                    labelClass: "font-weight-light small mb-0",
                    labelDisplay: "none",
                  },
                  {
                    field: {
                      name: "date_due",
                      label: "LBL_DUE_DATE",
                      fieldDefinition: {
                        name: "date_due",
                        vname: "LBL_DUE_DATE",
                        type: "datetime",
                        dbType: "datetime",
                        group: "date_due",
                        studio: {
                          required: true,
                          no_duplicate: true,
                        },
                        enable_range_search: true,
                        options: "date_range_search_dom",
                        required: false,
                        legacyGroup: true,
                        groupFields: {
                          date_due_flag: {
                            name: "date_due_flag",
                            vname: "LBL_DATE_DUE_FLAG",
                            type: "bool",
                            group: "date_due",
                            studio: false,
                            required: false,
                          },
                          date_due: {
                            name: "date_due",
                            vname: "LBL_DUE_DATE",
                            type: "datetimecombo",
                            dbType: "datetime",
                            group: "date_due",
                            studio: {
                              required: true,
                              no_duplicate: true,
                            },
                            enable_range_search: true,
                            options: "date_range_search_dom",
                            required: false,
                          },
                        },
                      },
                      type: "datetime",
                    },
                    labelClass: "font-weight-light small mb-0",
                    labelDisplay: "top",
                    class: "font-weight-light small my-0 ",
                  },
                ],
              },*/
            ],
          },
          actions: [
            {
              key: "edit",
              icon: "pencil",
              titleKey: "LBL_EDIT",
              klass: [
                "btn btn-outline-light fill-primary fill-hover-main  btn-xs p-0",
              ],
              modes: ["detail"],
              acl: [],
            },
            {
              key: "cancel",
              icon: "cross",
              titleKey: "LBL_CANCEL",
              klass: [
                "btn btn-outline-light fill-primary fill-hover-main  btn-xs p-0",
              ],
              modes: ["edit"],
              acl: [],
            },
            {
              key: "save",
              icon: "tick",
              titleKey: "LBL_SAVE_BUTTON_LABEL",
              klass: [
                "btn btn-outline-light fill-primary fill-hover-main btn-xs p-0",
              ],
              modes: ["edit"],
              acl: [],
            },
            {
              key: "delete",
              icon: "minimise",
              titleKey: "LBL_DELETE",
              asyncProcess: true,
              params: {
                displayConfirmation: true,
                confirmationLabel: "NTC_DELETE_CONFIRMATION",
              },
              // klass: [,],
              // modes: [],
              klass: [
                "btn btn-outline-light fill-primary fill-hover-main  btn-xs p-0",
              ],
              modes: ["detail"],
              acl: [],
            },
          ],
        },
      },
      create: {},
      //   create: {
      //     layout: {
      //       header: {
      //         rows: [],
      //       },
      //       body: {
      //         rows: [
      //           {
      //             justify: "start",
      //             class: "flex-grow-1",
      //             cols: [
      //               {
      //                 field: {
      //                   name: "name",
      //                   label: "LBL_SUBJECT",
      //                   fieldDefinition: {
      //                     name: "name",
      //                     vname: "LBL_SUBJECT",
      //                     dbType: "varchar",
      //                     type: "name",
      //                     len: "50",
      //                     unified_search: true,
      //                     full_text_search: {
      //                       boost: 3,
      //                     },
      //                     importable: "required",
      //                     required: true,
      //                   },
      //                   type: "name",
      //                 },
      //                 labelDisplay: "top",
      //                 labelClass: "mb-0",
      //                 class: "flex-grow-1",
      //               },
      //             ],
      //           },
      //         ],
      //       },
      //     },
      //   },
    };

    if (this.context$ && this.context$.subscribe()) {
      this.subs.push(
        this.context$.subscribe((context: ViewContext) => {
          this.context = context;
        })
      );
    }

    // this.recordThreadConfig = this.getConfig();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  getHeaderLabel(): string {
    return this.getLabel(this.config.labelKey) || "";
  }

  getLabel(key: string): string {
    const context = this.context || ({} as ViewContext);
    const module = context.module || "";

    return this.language.getFieldLabel(key, module);
  }

  getConfig(column: string): RecordThreadConfig {
    const columnOptions = deepClone(this.options);
    columnOptions.filters.static = {
      status: {
        field: "status",
        operator: "=",
        values: [column],
      },
    };

    const filter$ = this.initFilters$(columnOptions);
    const presetFields$ = this.initPresetFields$(columnOptions);

    const config = {
      filters$: filter$,
      //   presetFields$: presetFields$,
      module: columnOptions.module,
      klass: columnOptions.class || "",
      maxListHeight: columnOptions.maxListHeight ?? 350,
      direction: "desc",
      create: false,
      //   create: !!columnOptions.create,
      itemConfig: {
        collapsible: columnOptions.item.collapsible || false,
        collapseLimit: columnOptions.item.collapseLimit || null,
        klass: columnOptions.item.itemClass || "",
        dynamicClass: columnOptions.item.dynamicClass || [],
        metadata: {} as RecordThreadItemMetadata,
      },
      createConfig: {
        collapsible: false,
        metadata: {} as RecordThreadItemMetadata,
      },
    } as RecordThreadConfig;

    this.setupItemMetadata(
      config.itemConfig.metadata,
      columnOptions.item.layout
    );
    this.setupItemMetadata(
      config.createConfig.metadata,
      columnOptions.create.layout
    );

    return config;
  }

  protected setupItemMetadata(
    metadata: RecordThreadItemMetadata,
    config: ThreadItemMetadataConfig
  ) {
    if (config && config.header) {
      metadata.headerLayout = deepClone(config.header);
    }

    if (config && config.body) {
      metadata.bodyLayout = deepClone(config.body);
    }

    if (config && config.actions) {
      metadata.actions = deepClone(config.actions);
    }

    if (config && config.fields) {
      metadata.fields = deepClone(config.fields);
    }

    if ((config?.collapseActions ?? null) !== null) {
      metadata.collapseActions = config?.collapseActions;
    }
  }

  protected initFilters$(columnOptions) {
    if (!columnOptions || !columnOptions.filters) {
      return of({});
    }

    const parentFilters =
      columnOptions.filters.parentFilters || ({} as StringMap);

    let context$ = of({}).pipe(shareReplay());

    if (Object.keys(parentFilters).length > 0) {
      context$ = this.context$.pipe(
        filter((context) => {
          const record = (context && context.record) || ({} as Record);
          return !!(record.attributes && Object.keys(record.attributes).length);
        })
      );
    }

    return context$.pipe(
      map((context) => {
        const filters = {
          filters: {} as SearchCriteriaFilter,
        } as SearchCriteria;

        this.initParentFilters(context, filters, columnOptions);

        const staticFilters =
          columnOptions.filters.static || ({} as SearchCriteriaFilter);

        filters.filters = {
          ...filters.filters,
          ...staticFilters,
        };

        if (columnOptions.filters.orderBy) {
          filters.orderBy = columnOptions.filters.orderBy;
        }

        if (columnOptions.filters.sortOrder) {
          filters.sortOrder = columnOptions.filters.sortOrder;
        }

        return filters;
      }),
      distinctUntilChanged()
    );
  }

  protected initPresetFields$(columnOptions) {
    if (
      !columnOptions ||
      !columnOptions.create ||
      !columnOptions.create.presetFields
    ) {
      return of({});
    }

    return this.context$.pipe(
      map((context) => {
        const parentValues = this.initParentValues(context, columnOptions);

        const staticValues =
          columnOptions.create.presetFields.static || ({} as AttributeMap);
        return {
          ...parentValues,
          ...staticValues,
        };
      }),
      distinctUntilChanged()
    );
  }

  protected initParentFilters(context, filters, columnOptions) {
    const parentFilters =
      columnOptions.filters.parentFilters || ({} as StringMap);
    if (!context || !context.record || !parentFilters) {
      return;
    }

    Object.keys(parentFilters).forEach((parentField) => {
      const field = parentFilters[parentField];
      const value = context.record.attributes[parentField] || "";

      if (!value) {
        return;
      }

      filters.filters[field] = {
        field: parentFilters,
        operator: "=",
        values: [value],
      };
    });
  }

  protected initParentValues(
    context: ViewContext,
    columnOptions
  ): AttributeMap {
    const parentValues =
      columnOptions.create.presetFields.parentValues || ({} as StringMap);
    if (!context || !context.record || !parentValues) {
      return;
    }

    const attributes = {} as AttributeMap;

    Object.keys(parentValues).forEach((parentField) => {
      const field = parentValues[parentField];
      const value = context.record.attributes[parentField] || "";

      if (!value) {
        return;
      }

      attributes[field] = value;
    });

    return attributes;
  }
}
