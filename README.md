# flat

flat (free language annotation tool) is a generic text labeling web platform.


The figure shows the interface used during the annotation of tweets during a project about Sentiment Analysis.


![flat free language annotation tool](https://www.researchgate.net/profile/Alejandro_Molina_Villegas/publication/317650100/figure/fig2/AS:613445061836851@1523268108598/A-system-for-the-annotation-of-tweets-polarity-in-French_W640.jpg "flat")

In the figure, the components are:

    1. Text area: allows selection but not edition.
    2. Polarity buttons: assign the polarity of a selected passage and make appear a target text bar when pressed.
    3. Targets section: contains one editable target text bar for each selected passage showing a color depending on the polarity.
    4. Restart button: restores the interface to initial conditions.
    5. Send button: sends the annotations to the database and displays the next tweet to analyze.
    6. Confidence radio buttons: allow annotators to indicate if the tweet is out of context. 

### Dependencies

    * Apache
    * PHP
    * MySQL
    * JQuery

### Data

Create the following tables:

```
tweets
    tweet_id        (PK)
    tweet_title     (varchar)
    tweet_contents  (varchar)
    annotation      (varchar)

users
  usr_id
  usr_name
```


## Authors

* **Alejandro Molina-Villegas** - [Conacyt-CentroGeo](http://mid.geoint.mx/site/integrante/id/15.html)

* **Edwyn Aldana Bobadilla** - [Cinvestav (Tamps.)](https://www.tamps.cinvestav.mx/investigador_edwyn_javier_aldana_bobadilla)


## Cite


[Active learning in annotating micro-blogs dealing with e-reputation. Available from researchgate]( https://www.researchgate.net/publication/317650100_Active_learning_in_annotating_micro-blogs_dealing_with_e-reputation.)


[Active learning in annotating micro-blogs dealing with e-reputation. Available from arXiv]( https://arxiv.org/pdf/1706.05349)


####Bibtex

```
@article{cossu2017active,
  title={Active learning in annotating micro-blogs dealing with e-reputation},
  author={Cossu, Jean-Val{\`e}re and Molina-Villegas, Alejandro and Tello-Signoret, Mariana},
  journal={arXiv preprint arXiv:1706.05349},
  year={2017}
}

```

####APA

Cossu, J. V., Molina-Villegas, A., & Tello-Signoret, M. (2017). Active learning in annotating micro-blogs dealing with e-reputation. arXiv preprint arXiv:1706.05349.



## License

flat is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

flat is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the License for the specific language governing permissions and
limitations under the License.
