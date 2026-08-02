import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  createDashboardSavedView,
  moveDashboardSection,
  resetDashboardPreferences,
  toggleDashboardSection,
  updateDashboardDensity,
  updateDashboardLayoutMode,
  updateDashboardSavedView,
} from "../personalization/dashboard-personalization-engine";

import {
  readDashboardPersonalizationState,
  writeActiveDashboardViewId,
  writeDashboardPreferences,
  writeDashboardSavedViews,
} from "../personalization/dashboard-personalization-storage";

import type {
  DashboardDensity,
  DashboardLayoutMode,
  DashboardSectionId,
} from "../personalization/dashboard-personalization-types";

export function useDashboardPersonalization() {
  const [
    state,
    setState,
  ] = useState(
    readDashboardPersonalizationState,
  );

  const persistPreferences =
    useCallback(
      (
        preferences:
          typeof state.preferences,
      ) => {
        writeDashboardPreferences(
          preferences,
        );

        setState(
          (
            current,
          ) => ({
            ...current,
            preferences,
          }),
        );
      },
      [],
    );

  const setDensity =
    useCallback(
      (
        density:
          DashboardDensity,
      ) => {
        persistPreferences(
          updateDashboardDensity(
            state.preferences,
            density,
          ),
        );
      },
      [
        persistPreferences,
        state.preferences,
      ],
    );

  const setLayoutMode =
    useCallback(
      (
        layoutMode:
          DashboardLayoutMode,
      ) => {
        persistPreferences(
          updateDashboardLayoutMode(
            state.preferences,
            layoutMode,
          ),
        );
      },
      [
        persistPreferences,
        state.preferences,
      ],
    );

  const toggleSection =
    useCallback(
      (
        sectionId:
          DashboardSectionId,
      ) => {
        persistPreferences(
          toggleDashboardSection(
            state.preferences,
            sectionId,
          ),
        );
      },
      [
        persistPreferences,
        state.preferences,
      ],
    );

  const moveSection =
    useCallback(
      (
        sectionId:
          DashboardSectionId,
        direction:
          "up" |
          "down",
      ) => {
        persistPreferences(
          moveDashboardSection(
            state.preferences,
            sectionId,
            direction,
          ),
        );
      },
      [
        persistPreferences,
        state.preferences,
      ],
    );

  const resetPreferences =
    useCallback(() => {
      const preferences =
        resetDashboardPreferences();

      writeDashboardPreferences(
        preferences,
      );

      writeActiveDashboardViewId(
        null,
      );

      setState(
        (
          current,
        ) => ({
          ...current,
          preferences,
          activeViewId: null,
        }),
      );
    }, []);

  const saveView =
    useCallback(
      (
        name: string,
        description: string,
      ) => {
        const view =
          createDashboardSavedView(
            name,
            description,
            state.preferences,
          );

        const savedViews = [
          ...state.savedViews,
          view,
        ];

        writeDashboardSavedViews(
          savedViews,
        );

        writeActiveDashboardViewId(
          view.id,
        );

        setState({
          preferences:
            view.preferences,

          savedViews,

          activeViewId:
            view.id,
        });

        return view;
      },
      [
        state.preferences,
        state.savedViews,
      ],
    );

  const applyView =
    useCallback(
      (
        viewId: string,
      ) => {
        const view =
          state.savedViews.find(
            (item) =>
              item.id ===
              viewId,
          );

        if (!view) {
          return;
        }

        writeDashboardPreferences(
          view.preferences,
        );

        writeActiveDashboardViewId(
          view.id,
        );

        setState(
          (
            current,
          ) => ({
            ...current,

            preferences:
              view.preferences,

            activeViewId:
              view.id,
          }),
        );
      },
      [
        state.savedViews,
      ],
    );

  const updateActiveView =
    useCallback(() => {
      if (!state.activeViewId) {
        return;
      }

      const savedViews =
        state.savedViews.map(
          (view) =>
            view.id ===
            state.activeViewId
              ? updateDashboardSavedView(
                  view,
                  state.preferences,
                )
              : view,
        );

      writeDashboardSavedViews(
        savedViews,
      );

      setState(
        (
          current,
        ) => ({
          ...current,
          savedViews,
        }),
      );
    }, [
      state.activeViewId,
      state.preferences,
      state.savedViews,
    ]);

  const deleteView =
    useCallback(
      (
        viewId: string,
      ) => {
        const savedViews =
          state.savedViews.filter(
            (view) =>
              view.id !==
              viewId,
          );

        const activeViewId =
          state.activeViewId ===
          viewId
            ? null
            : state.activeViewId;

        writeDashboardSavedViews(
          savedViews,
        );

        writeActiveDashboardViewId(
          activeViewId,
        );

        setState(
          (
            current,
          ) => ({
            ...current,
            savedViews,
            activeViewId,
          }),
        );
      },
      [
        state.activeViewId,
        state.savedViews,
      ],
    );

  const visibleSections =
    useMemo(
      () =>
        state.preferences
          .sections
          .filter(
            (section) =>
              section.visible,
          )
          .sort(
            (
              left,
              right,
            ) =>
              left.order -
              right.order,
          ),
      [
        state.preferences
          .sections,
      ],
    );

  return {
    ...state,

    visibleSections,

    setDensity,
    setLayoutMode,
    toggleSection,
    moveSection,
    resetPreferences,
    saveView,
    applyView,
    updateActiveView,
    deleteView,
  };
}
