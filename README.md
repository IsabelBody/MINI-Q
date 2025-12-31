# Digitising the MINI-Q Tool
![MINI-Q Logo Image](https://github.com/user-attachments/assets/72462356-66c1-4a71-8597-5159edccf822)

This project aims to address the critical communication gap between healthcare professionals and patients regarding medication information by digitising the MINI-Q (Medicines Information Needs for Individuals Questionnaire). 

### Deployed at https://miniq.nz/

### View the demonstration video [here](https://youtu.be/lzzGcyjVAGo).

### Project Portfolio
View our project portfolio [here](https://www.capitalise.space/projects/6735c9b39df43e2d89d98c6e).
<br>

## Project Management Tools
We set up a dedicated backlog in [Jira](https://cs399-team-megamind.atlassian.net/jira/software/projects/MINIQ/boards/1/timeline) for each project objective.

For version control, we used Git branching for each task, and created additional GitHub issues for tracking and fixing bugs.
<br>

## Technologies
<table border="1" cellpadding="10" cellspacing="0">
  <tr>
    <th>Languages</th>
    <td>
      Typescript
    </td>
  </tr>
  
  <tr>
    <th>Libraries & <br>Frameworks</th>
    <td>
      React (18.3.1)<br>
      Vite (5.4.0)<br>
      Zod (3.23.8)<br>
      Lucide (0.433.0)<br>
      Tailwind CSS & shadcn (3.4.9)<br>
      Framer Motion (11.11.8)<br>
      html2canvas (1.4.1)<br>
      jsPDF (2.5.1)<br>
      React-pdf (3.4.4)<br>
      Nodemailer (6.9.15)<br>
      Express (4.19.2)<br>
      Node.js (20.12.2)
    </td>
  </tr>
  
  <tr>
    <th>Database</th>
    <td>
      PostgreSQL
    </td>
  </tr>
  
  <tr>
    <th>Cloud Services</th>
    <td>
      Amazon RDS<br>
      Amazon EC2
    </td>
  </tr>
  <tr>
    <th>Deployment</th>
    <td>
      NGINX<br>
      PM2
    </td>
  </tr>
</table>


## Getting Started
To get started, clone this repo and install all dependencies in the `client` and `server` directories:
```
$ git clone https://github.com/uoa-compsci399-s2-2024/capstone-project-team-30.git
$ cd client
$ npm install

$ cd ../server
$ npm install
```
> [!NOTE]
> To submit a questionnaire response, send a PDF of the visualisation or interact with the clinician portal, the following environment variables must be set by following this [technical documentation](https://drive.google.com/file/d/1FgQTHCbxm6iZlp5NbPU6MKQxOHxu-nt2/view?usp=sharing). This documentation includes other relevant information for future developers working on this project, such as creating resources and deploying  the application on AWS.
> * `PORT`
> * `NODE_ENV`
> * `DB_PORT`
> * `DB_USER`
> * `DB_PASSWORD`
> * `DB_HOST`
> * `DB_NAME`
> * `EMAIL_SENDER`
> * `EMAIL_APP_PASSWORD`

## Running the Application locally
Open two terminals.

In the first, run:
```
$ cd client
$ npm run dev
```

In the second, run:
```
$ cd server
$ npm run dev
```

## Usage Examples

### Patient Side
To explore the questionnaire, select *I'm a patient* on the homepage and proceed through the form steps.

<img width="70%" alt="homepage" src="https://github.com/user-attachments/assets/de573cb6-e39c-4ead-8210-faa17d8723ab">


### Clinician Side
Admins can invite other clinicians and assign administrators as well. To access the clinician portal as an admin, please select *I'm a clinician* on the homepage and use the following credentials to log in:

**Email**: `clinicianlogin@email.com`<br>
**Password**: `password`


Once logged in, you can search patient responses using the Search Bar and/or Date of Birth picker, as well as filter the responses by clicking on any column.
To invite other clinicians, hover over the username, click *invite a clinician* and proceed.

<img width="70%" alt="accessingclinicianinvitation" src="https://github.com/user-attachments/assets/62e29a51-7e7c-4b48-aa24-adbf35093164">
<br><br>

Now, you may invite another clinician with basic clinician access or choose to give them admin access.

<img width="70%" alt="invitingaclinician" src="https://github.com/user-attachments/assets/756a7a4b-5d31-497e-b322-786386795727">


### Exporting Visualisation
As a patient or clinician, you can export the visual summary from the response page by clicking *Export to PDF* on the upper right corner.

<img width="70%" alt="howtoemailpdf" src="https://github.com/user-attachments/assets/3a4a7041-5bd1-4358-a9ce-ddcc4639fa2b">
<br><br>

Then, enter the desired email address and hit the blue send button.

<img width="70%" alt="emailingpdf" src="https://github.com/user-attachments/assets/67a7be27-60b3-45d9-8082-b4855a1c0d21">


## Future Plans

<table>
  <tr>
    <td style="padding-right: 20px; vertical-align: top;">
      <h3>Customization of Accessibility Features</h3>
      <ul>
        <li>Introduce light and dark mode options</li>
        <li>Expand language support, starting with Te Reo Māori</li><br>
      </ul>
    </td>
    <td style="padding-right: 20px; vertical-align: top;">
      <h3>Enhanced Administrative Control</h3>
      <ul>
        <li>Develop an administrator login page</li>
        <li>Allow administrators to view and change who has permissions</li><br>
      </ul>
    </td>
  </tr>
  <tr>
    <td style="padding-left: 20px; vertical-align: top;">
      <h3>Integration with Healthcare Systems</h3>
      <ul>
        <li>Integrate MINI-Q into patient's official clinical records</li><br>
      </ul>
    </td>
    <td style="padding-right: 20px; vertical-align: top;">
      <h3>Historical Data Storage</h3>
      <ul>
        <li>Record previous patient submissions</li>
        <li>Enable clinicians to view several submissions of a single patient</li><br>
      </ul>
    </td>
  </tr>
</table>

## Contributors ✨ 

The team behind it all ([emoji key](https://allcontributors.org/docs/en/emoji-key))

<table>
  <tr>
    <td align="center"><a href="https://github.com/IsabelBody"><img src="https://github.com/user-attachments/assets/3ce34701-f058-4641-bc03-98d739ae0e91" width="140px" height="140px"/></a><br /><a href="https://www.linkedin.com/in/isabelbody/"><b><sub>Isabel Body</sub></b></a></br> <sub>Backend 💻🛡️</sub><br /><sub>isabelbody@gmail.com</sub></td>
    <td align="center"><a href="https://github.com/laibatool792"><img src="https://github.com/user-attachments/assets/994f00df-d2bd-4524-992c-807191fcfc36" width="140px" height="140px;"/></a><br /><a href="https://www.linkedin.com/in/laiba-batoolcs/"><b><sub>Laiba Batool</sub></b></a></br> <sub>Backend 💻🛡️</sub><br /><sub>laibatool792@gmail.com</sub></td>
    <td align="center"><a href="https://github.com/micattoc"><img src="https://github.com/user-attachments/assets/5a0b06e5-58b0-4a95-84c4-f8439b3a07db" width="140px" height="140px;"/></a><br /><a href="https://www.linkedin.com/in/sophia-halapchuk/"><b><sub>Sophia Halapchuk</sub></b></a></br> <sub>Full-stack 💻📖</sub><br /><sub>micattoc@gmail.com</sub></td>
    <td align="center"><a href="https://github.com/nancywu45"><img src="https://github.com/user-attachments/assets/ee6b0ec0-dc6d-4548-8831-3050349ff623" width="140px" height="140px;"/></a><br /><a href="https://www.linkedin.com/in/nancywu45/"><b><sub>Nancy Wu</sub></b></a></br> <sub>Frontend 💻🎨</sub><br /><sub>nancywu45@gmail.com</sub></td>
  </tr>
</table>

## Acknowledgements
- The ADHB clinicians and students who were part of our user testing
- Our clients Trudi Aspden, Kim Brackley, Amy Chan and Michelle Honey
- The teaching staff Asma Shakil and Mark Zhu
- [Te Whatu Ora](https://www.tewhatuora.govt.nz/) and [Book a vaccine website](https://info.health.nz/immunisations/booking-a-vaccine) for aesthetic inspiration


## Demo Music References
1. PianoAmor. (2024). *Spring Sunshine (Piano Solo Ver)* [Instrumental]. Pixabay. https://pixabay.com/music/modern-classical-spring-sunshine-piano-solo-ver-216052/
2. SoulProdMusic. (2024). *Medical Logo (5 Versions)* [Instrumental]. Pixabay. https://pixabay.com/music/corporate-medical-logo-5-versions-187240/
3. SoulProdMusic. (2024). *Medical Product* [Instrumental]. Pixabay. https://pixabay.com/music/corporate-medical-product-205493/

