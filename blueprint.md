# AI Library Project Blueprint

## Overview

This document outlines the features and implementation details of the AI Library web application. The initial feature is a simple Lotto Number Generator.

## Current Features

### Lotto Number Generator

*   **Functionality:** 
    *   Generates a configurable number of unique random numbers within a configurable range (e.g., 1-45, 1-50).
    *   Allows copying the generated numbers to the clipboard.
    *   Keeps a history of the generated numbers.
    *   Provides a reset function to clear current numbers and history.
    *   Saves and loads generated numbers from local storage.
    *   Allows users to mark and save favorite number sets.
    *   Enables sharing of generated numbers via URL or social media.
    *   Generates multiple sets of lotto numbers at once.
    *   Suggests numbers based on predefined "Smart Pick" criteria (e.g., common numbers, overdue numbers).
    *   Provides theme selection for visual customization.
*   **Implementation:**
    *   A custom Web Component `lotto-generator` will encapsulate the logic and UI.
    *   A button will trigger the number generation.
    *   The generated numbers will be displayed in a visually appealing way.
*   **Styling:** Modern and clean design with responsive layout.

## Development Plan

1.  **[Completed]** Initial project setup.
2.  **[Completed]** Implement the Lotto Number Generator.
    *   **[Completed]** Create `blueprint.md`.
    *   **[Completed]** Modify `index.html` to include the `lotto-generator` component.
    *   **[Completed]** Create the `lotto-generator` Web Component in `main.js`.
    *   **[Completed]** Style the component in `style.css`.
3.  **[Completed]** Implement 'Copy to Clipboard' feature.
    *   **[Completed]** Add a 'Copy' button to the `lotto-generator` component.
    *   **[Completed]** Implement the clipboard functionality in `main.js`.
4.  **[Completed]** Implement 'History of Generated Numbers' feature.
    *   **[Completed]** Add a section to display the history of generated numbers.
    *   **[Completed]** Implement logic to store and display past generated numbers.
5.  **[Completed]** Implement 'Reset Functionality' feature.
    *   **[Completed]** Add a 'Reset' button to the `lotto-generator` component.
    *   **[Completed]** Implement the logic to clear current numbers and history.
6.  **[Completed]** Implement 'Save to Local Storage' feature.
    *   **[Completed]** Add a 'Save' button to the `lotto-generator` component.
    *   **[Completed]** Implement logic to save the current generated numbers and history to local storage.
    *   **[Completed]** Implement logic to load saved numbers and history from local storage on component initialization.
7.  **[Completed]** Implement 'Configurable Number Range' feature.
    *   **[Completed]** Add input fields for minimum and maximum numbers to the `lotto-generator` component.
    *   **[Completed]** Update the number generation logic to use the configured range.
    *   **[Completed]** Persist the selected range in local storage.
8.  **[Completed]** Implement 'Configurable Number of Balls' feature.
    *   **[Completed]** Add an input field for the number of balls to generate to the `lotto-generator` component.
    *   **[Completed]** Update the number generation logic to use the configured number of balls.
    *   **[Completed]** Persist the selected number of balls in local storage.
9.  **[Completed]** Implement 'Styling Enhancements' feature.
    *   **[Completed]** Improve overall visual appeal and responsiveness.
    *   **[Completed]** Refine button styles, input field aesthetics, and number ball animations.
10. **[Completed]** Implement 'Favorites' feature.
    *   **[Completed]** Add a 'Favorite' button to save the current set of generated numbers.
    *   **[Completed]** Display a list of saved favorite number sets.
    *   **[Completed]** Implement functionality to load a favorite set.
    *   **[Completed]** Persist favorite sets in local storage.
11. **[Completed]** Implement 'Share Functionality' feature.
    *   **[Completed]** Add a 'Share' button.
    *   **[Completed]** Implement logic to generate a shareable URL with current numbers, range, and number of balls.
    *   **[Completed]** Optionally, integrate with Web Share API for direct sharing.
12. **[Completed]** Implement 'Generate Multiple Sets' feature.
    *   **[Completed]** Add an input field for the number of sets to generate.
    *   **[Completed]** Update the generation logic to create and display multiple sets of numbers.
    *   **[Completed]** Persist the number of sets in local storage.
13. **[Completed]** Implement 'Smart Pick' feature.
    *   **[Completed]** Add a 'Smart Pick' button.
    *   **[Completed]** Implement logic to generate numbers based on simple "smart" criteria (e.g., most/least frequent, overdue).
14. **[In Progress]** Implement 'Theme Selection' feature.
    *   Add a theme selector (e.g., dropdown, buttons) to allow users to switch themes.
    *   Define different CSS variables or classes for various themes.
    *   Persist the selected theme in local storage.