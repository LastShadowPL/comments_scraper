import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Comment } from './interfaces/comment.interface';
import { User } from './interfaces/user.interface';
import { inBrowser } from "./inbrowser/main"

@Injectable()
export class ReaderService {

  async getComments(url: string, waitForComments: number, waitAfterScroll: number): Promise<Comment[]> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.goto(url, { waitUntil: 'networkidle2' }).catch(console.error);
    const comments: Comment[] = await page.evaluate(inBrowser, waitForComments, waitAfterScroll).catch(browser.close)
    await browser.close();
    if(comments.length) {
      return comments
    } else {
      return []
    }
  }
}
/*.map(
            (el): Comment => {
              const Image: string = el
                .querySelector('img#img')
                .getAttribute('src');
              const Name: string = el.querySelector(
                'span.style-scope.ytd-comment-renderer',
              ).innerHTML;
              const Url = el
                .querySelector('a.yt-simple-endpoint')
                .getAttribute('href');
              const Content = el.querySelector('#content-text').innerHTML;
              const Likes = +el.querySelector('span#vote-count-left')
                .innerHTML;
              return {
                Author: {
                  Image,
                  Name,
                  Url,
                },
                Content,
                Likes,
              };
            },
          );*/
