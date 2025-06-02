# RCA Fishbone Diagram HTML Application for SharePoint

An interactive HTML-based tool for conducting Root Cause Analysis (RCA) using the Fishbone (Ishikawa) diagram. This application allows teams to collaboratively identify, categorize, and analyze potential causes of a problem. It is designed to be lightweight and easily embeddable into SharePoint Online modern pages via GitHub Pages.

---

## Preview

**(Recommended: Add an actual screenshot or GIF of your application. Upload your image (e.g., `screenshot.png`) to an `assets` folder, preferably within `rca-fishbone-analyzer/assets/screenshot.png` or at the root in `assets/screenshot.png`, and update the path below if necessary.)**

![RCA FishMain interface of the RCA Fishbone Application (Replace with your actual screenshot and update the path if needed. Ensure the image file is in your repository, e.g., in an 'assets' folder.)*

---

## Table of Contents

*   [Features](#features)
*   [Technology Stack](#technology-stack)
*   [Live Demo](#live-demo)
*   [SharePoint Integration Guide](#sharepoint-integration-guide)
*   [How to Use the Application](#how-to-use-the-application)
*   [File Structure](#file-structure)
*   [Contributing](#contributing)
*   [License](#license)
*   [Contact](#contact)

---

## Features

*   **Interactive Fishbone Diagram**: Visually construct an Ishikawa diagram.
*   **Methodology Support**: Supports common frameworks like:
    *   6M (Manpower, Method, Machine, Material, Measurement, Mother Nature) for manufacturing.
    *   4P (Policy, Process, People, Plant/Technology) for service/office environments.
    *   *(Adjust or add if your app supports custom categories)*
*   **Problem Statement Definition**: Clearly define the problem being analyzed.
*   **Cause Categorization**: Add main categories (bones) and multiple levels of sub-causes.
*   **Simple Interface**: Intuitive and easy to use without extensive training.
*   **Lightweight & Standalone**: Runs entirely in the browser with no backend dependencies.
*   **Responsive Design**: Usable on various screen sizes (desktops, tablets).
*   **Save/Load Functionality (Optional)**: *(Include if your app has this feature)* Ability to save current analysis to a local file and load it back.
*   **Export Diagram (Optional)**: *(Include if your app has this feature)* Option to export the diagram as an image (e.g., PNG, SVG) or data (e.g., JSON).

---

## Technology Stack

*   **HTML5**: For the basic structure and content.
*   **CSS3**: For styling and presentation.
*   **Vanilla JavaScript (ES6+)**: For interactivity and application logic.

---

## Live Demo

You can try the application live here, hosted on GitHub Pages (assuming `index.html` is inside the `rca-fishbone-analyzer` folder):

➡️ **[RCA Fishbone App Live Demo](https://ComplianceGJL.github.io/Root-Cause-Analysis/rca-fishbone-analyzer/)**

*(Ensure your GitHub Pages is configured to serve from the `main` branch and your `index.html` is located at `rca-fishbone-analyzer/index.html` for this URL to work correctly with the repository named "Root-Cause-Analysis".)*

---

## SharePoint Integration Guide

This application is designed to be easily embedded into SharePoint Online modern pages using its GitHub Pages URL.

**Steps to Integrate:**

1.  **Get the GitHub Pages URL**:
    *   Ensure your application is deployed to GitHub Pages from the repository named "Root-Cause-Analysis". The URL will be: `https://ComplianceGJL.github.io/Root-Cause-Analysis/rca-fishbone-analyzer/`.
    *   This assumes your main HTML file is `index.html` located inside the `rca-fishbone-analyzer` directory in your repository.

2.  **Navigate to Your SharePoint Page**:
    *   Open the SharePoint Online modern page where you want to embed the application.

3.  **Edit the SharePoint Page**:
    *   Click the "Edit" button, usually located in the top-right corner of the page.

4.  **Add the Embed Web Part**:
    *   Hover your mouse where you want to add the app on the page. A line with a circled `+` icon will appear. Click it.
    *   In the web part search box that appears, type "Embed" and select the "Embed" web part.

5.  **Configure the Embed Web Part**:
    *   A property pane will open on the right (or a box in the center of the web part).
    *   In the field labeled "Website address or embed code", paste the full GitHub Pages URL of your application:
        *   `https://ComplianceGJL.github.io/Root-Cause-Analysis/rca-fishbone-analyzer/`

6.  **Adjust Sizing (Optional)**:
    *   The Embed web part will attempt to display the content. You might need to adjust the height if it doesn't display correctly. Sometimes setting a fixed pixel height in the web part properties works better than `100%`.

7.  **Save and Publish**:
    *   Click "Republish" or "Publish" (or "Save as draft") to save your changes to the SharePoint page.

Your RCA Fishbone application should now be visible and interactive within your SharePoint page.

**Troubleshooting SharePoint Integration:**
*   **"Embedding content from this website isn't allowed"**: Your SharePoint administrator may need to add `ComplianceGJL.github.io` to the list of allowed domains in the HTML Field Security settings at the Site Collection level. (Site Settings > HTML Field Security).
*   **Content Not Displaying (404 Error)**: Ensure your GitHub Pages site is correctly deployed from the repository named "Root-Cause-Analysis", that the `rca-fishbone-analyzer` folder and `index.html` within it exist on the `main` branch (or whichever branch you are using for GitHub Pages), and that the repository is public if using a free GitHub account. It can take a few minutes for GitHub Pages to update after a push or repository rename.
*   **Content Not Displaying (Blank)**: Check the browser's developer console (usually F12) for errors. Ensure all paths to CSS, JS, and image files within your HTML are relative and correct for the GitHub Pages hosting structure.

---

## How to Use the Application

1.  **Define Problem Statement**:
    *   Locate the "Problem Statement" input field (usually at the "head" of the fish).
    *   Type in a clear and concise description of the problem you are analyzing.

2.  **Select Methodology (If Applicable)**:
    *   If your application offers presets like 6M or 4P, select the one most relevant to your context. Otherwise, the main categories will be predefined or customizable.

3.  **Add Main Causes (Categories)**:
    *   The main "bones" of the fish represent major cause categories (e.g., "Manpower," "Method").
    *   Click on the designated area for a main category or a "+" button associated with it to add or edit its name.

4.  **Add Potential Causes**:
    *   For each main category, brainstorm potential causes related to it.
    *   Click on a main bone or an "add cause" button associated with it to add a potential cause branching off that bone.

5.  **Add Sub-Causes (5 Whys Technique)**:
    *   For each potential cause, ask "Why?" to drill down to deeper, more fundamental root causes.
    *   Click on an existing cause to add a sub-cause branching off it. Repeat this process as needed.

6.  **(Optional) Save/Load Analysis**:
    *   If your application supports saving, look for a "Save" button. This might download a JSON or similar file containing your analysis.
    *   A "Load" button would allow you to upload this file to restore a previous session.

7.  **(Optional) Export Diagram**:
    *   If export functionality exists, look for an "Export" or "Download Diagram" button. This might save the diagram as an image (PNG, SVG) or data.

---

## File Structure

A brief overview of the important files and directories in this repository:

*(Adjust this section if your actual file structure inside `rca-fishbone-analyzer` differs, especially the `assets` folder location.)*

---

## Contributing

Contributions are welcome! If you have suggestions for improvements, bug fixes, or new features, please feel free to:

1.  Fork the repository (`https://github.com/ComplianceGJL/Root-Cause-Analysis/fork`).
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5.  Push to the branch (`git push origin feature/AmazingFeature`).
6.  Open a Pull Request.

Alternatively, you can open an issue in this repository.

---

## License

This project is licensed under the **MIT License**.

*(It's good practice to add a `LICENSE` file to your repository containing the MIT License text. If you do, you can change the line above to: "This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.")*

---

## Contact

If you have any questions, encounter issues, or want to provide feedback, please open an issue in this GitHub repository: [ComplianceGJL/Root-Cause-Analysis/issues](https://github.com/ComplianceGJL/Root-Cause-Analysis/issues)

Created by: **ComplianceGJL**
