# 🧪 FormulaForge ✨

<div align="center">

<img src="https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white" alt="Excel"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>

**Transform natural language into Excel formulas with AI-powered assistance**

[✨ Features](#-features) • 
[🚀 Quick Start](#-quick-start) • 
[🎯 Usage Examples](#-usage-examples) • 
[🌍 Supported Languages](#-supported-languages) • 
[🛠️ Technology Stack](#️-technology-stack) • 
[📝 Contributing](#-contributing)

</div>

---

## What is FormulaForge?

<div align="center">
<table>
<tr>
<td width="70%">

FormulaForge is an intelligent Excel formula generator that transforms your natural language queries into working Excel formulas. Simply describe what you want to do, and FormulaForge will generate the formula for you - complete with explanations!

**Say goodbye to complex formula syntax and hello to natural language processing.**

</td>
<td width="30%">

<h3>💡 Perfect For</h3>
<ul>
  <li>Excel beginners</li>
  <li>Data analysts</li>
  <li>Financial modelers</li>
  <li>Students & educators</li>
  <li>Business professionals</li>
</ul>

</td>
</tr>
</table>
</div>

---

## ✨ Features

<div align="center">
<table>
<tr>
<td>🤖</td>
<td><b>AI-Powered Generation</b></td>
<td>Transform natural language into complex Excel formulas instantly</td>
</tr>
<tr>
<td>🌍</td>
<td><b>Multilingual Support</b></td>
<td>Works with both English and Indonesian language queries</td>
</tr>
<tr>
<td>📝</td>
<td><b>Clear Explanations</b></td>
<td>Get detailed explanations for every generated formula</td>
</tr>
<tr>
<td>⚡</td>
<td><b>Direct Formula Input</b></td>
<td>Enter formulas directly for validation and explanation</td>
</tr>
<tr>
<td>🔥</td>
<td><b>Quick Templates</b></td>
<td>Access common formula templates with a single click</td>
</tr>
<tr>
<td>📋</td>
<td><b>One-Click Copy</b></td>
<td>Copy formulas to clipboard with one click</td>
</tr>
<tr>
<td>💅</td>
<td><b>Modern UI</b></td>
<td>Enjoy a beautiful, responsive interface with smooth animations</td>
</tr>
</table>
</div>

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/FormulaForge.git
cd FormulaForge

# Install backend dependencies
cd backend
npm install

# Start the server
npm start

# Open your browser and navigate to http://localhost:3000
```

---

## 🎯 Usage Examples

<div align="center">
<table>
<tr>
<th>Type</th>
<th>Example Query</th>
<th>Generated Formula</th>
</tr>
<tr>
<td><b>Basic Aggregation</b></td>
<td>"Sum values in column A where column B is Yes"</td>
<td><code>=SUMIF(B:B, "Yes", A:A)</code></td>
</tr>
<tr>
<td><b>Lookup Functions</b></td>
<td>"Find value from column A where column B equals Smith and return column C"</td>
<td><code>=VLOOKUP("Smith", B:C, 2, FALSE)</code></td>
</tr>
<tr>
<td><b>Text Manipulation</b></td>
<td>"Get first 3 characters from column D"</td>
<td><code>=LEFT(D:D, 3)</code></td>
</tr>
<tr>
<td><b>Conditional Logic</b></td>
<td>"If column A equals Yes then Approved else Rejected"</td>
<td><code>=IF(A:A="Yes", "Approved", "Rejected")</code></td>
</tr>
<tr>
<td><b>Direct Formula</b></td>
<td>"=CONCATENATE(A:A, B:B, C:C)"</td>
<td><code>=CONCATENATE(A:A, B:B, C:C)</code></td>
</tr>
<tr>
<td><b>Indonesian</b></td>
<td>"Jumlahkan nilai di kolom A di mana kolom B adalah Ya"</td>
<td><code>=SUMIF(B:B, "Ya", A:A)</code></td>
</tr>
</table>
</div>

---

## 🌍 Supported Languages

<div align="center">
<table>
<tr>
<td width="50%" align="center">
<h3>🇺🇸 English</h3>

```
Sum values in column A where column B is Yes
```

</td>
<td width="50%" align="center">
<h3>🇮🇩 Indonesian</h3>

```
Jumlahkan nilai di kolom A di mana kolom B adalah Ya
```

</td>
</tr>
</table>
</div>

> 💡 **Tip:** FormulaForge can understand variations of queries in both languages. Try different ways of phrasing your request!

---

## 🧩 Supported Formula Types

<div align="center">

### Aggregation Functions
`SUM` • `AVERAGE` • `COUNT` • `SUMIF` • `AVERAGEIF` • `COUNTIF` • `SUMIFS` • `AVERAGEIFS` • `COUNTIFS`

### Lookup & Reference
`VLOOKUP` • `HLOOKUP` • `INDEX` • `MATCH` • `INDEX/MATCH Combination`

### Logical Functions
`IF` • `AND` • `OR` • `Nested IF Statements`

### Text Functions
`CONCATENATE` • `LEFT` • `RIGHT` • `MID` • `LEN` • `TRIM` • `UPPER` • `LOWER` • `PROPER` • `SUBSTITUTE`

### Math Functions
`ROUND` • `ROUNDUP` • `ROUNDDOWN`

</div>

---

## 🛠️ Technology Stack

<div align="center">
<table>
<tr>
<th width="33%">Frontend</th>
<th width="33%">Backend</th>
<th width="33%">Development</th>
</tr>
<tr>
<td>

- HTML5 & CSS3
- JavaScript (ES6+)
- Responsive Design
- CSS Animations
- Font Awesome Icons

</td>
<td>

- Node.js
- Express.js
- RESTful API
- Natural Language Processing
- Formula Generation Engine

</td>
<td>

- Git Version Control
- NPM Package Manager
- Modular Architecture
- ESLint Code Quality
- Responsive Testing

</td>
</tr>
</table>
</div>

---

## 📝 Contributing

Contributions are warmly welcomed! Here's how you can help make FormulaForge even better:

```bash
# Fork the repository
git clone https://github.com/[your-username]/FormulaForge.git

# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

### Ideas for Contributions

- 🌐 Add support for more languages
- 📊 Implement more Excel functions
- 🎨 Enhance UI/UX design
- 📱 Improve mobile responsiveness
- 🧪 Add unit and integration tests

---

<div align="center">

## Try FormulaForge Today!

<blockquote>
<p>"FormulaForge has revolutionized how I work with Excel. What used to take me minutes now takes seconds!"</p>
</blockquote>

<br>

<p>
<small>Made with ❤️ by the FormulaForge Team(Which is Me)</small>
</p>

<a href="https://github.com/Fauzananam/Formula-Forge/issues"><img src="https://img.shields.io/github/issues/yourusername/FormulaForge?style=flat-square" alt="Issues"/></a>
<a href="https://github.com/Fauzananam/Formula-Forge/network/members"><img src="https://img.shields.io/github/forks/yourusername/FormulaForge?style=flat-square" alt="Forks"/></a>
<a href="https://github.com/Fauzananam/Formula-Forge/stargazers"><img src="https://img.shields.io/github/stars/yourusername/FormulaForge?style=flat-square" alt="Stars"/></a>
<a href="https://github.com/Fauzananam/Formula-Forge/blob/master/LICENSE"><img src="https://img.shields.io/github/license/yourusername/FormulaForge?style=flat-square" alt="License"/></a>

</div>
