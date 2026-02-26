import os
import re
from collections import defaultdict

def extract_real_chapter_titles():
    """提取原著中的真实章节标题"""
    
    # 获取当前目录下所有txt文件
    txt_files = [f for f in os.listdir('.') if f.endswith('.txt') and f.startswith(tuple([str(i).zfill(3) for i in range(1, 300)]))]
    txt_files.sort()
    
    # 按集数分组
    episodes = defaultdict(list)
    
    for filename in txt_files:
        # 提取集数和序号
        match = re.match(r'(\d+)_(.+)\.txt', filename)
        if match:
            number = int(match.group(1))
            episode_name = match.group(2)
            episodes[episode_name].append((number, filename))
    
    # 提取每集的真实章节标题
    episode_info = {}
    
    for episode_name, files in episodes.items():
        files.sort()  # 按序号排序
        chapter_titles = []
        
        for i, (number, filename) in enumerate(files):
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # 提取第一行作为章节标题
                    first_line = content.split('\n')[0].strip()
                    
                    # 从标题中提取章节名称（去除集数和章节数字部分）
                    # 例如："第四集释魂龙戒第一章蓝清会行" -> "蓝清会行"
                    title_match = re.search(r'第[一二三四五六七八九十百千]+章(.+)', first_line)
                    if title_match:
                        chapter_title = title_match.group(1).strip()
                    else:
                        # 如果没有匹配到标准格式，使用备用方案
                        chapter_title = f"第{i+1}章"
                    
                    chapter_titles.append(chapter_title)
            except Exception as e:
                print(f"Error reading {filename}: {e}")
                chapter_titles.append(f"第{i+1}章")
        
        episode_info[episode_name] = {
            'files': files,
            'chapter_titles': chapter_titles
        }
    
    return episode_info

def create_new_structure_with_real_titles(episode_info):
    """使用真实标题创建新的目录结构"""
    
    # 集数对应的中文名称映射（根据原著内容）
    episode_names = {
        '第一集': '第一集-误入天庭',
        '第二集': '第二集-初涉修真', 
        '第三集': '第三集-天晶之秘',
        '第四集': '第四集-释魂龙戒',
        '第五集': '第五集-金丹大道',
        '第六集': '第六集-魔道争锋',
        '第七集': '第七集-九幽魔域',
        '第八集': '第八集-天劫降临',
        '第九集': '第九集-渡劫飞升',
        '第十集': '第十集-仙界初探',
        '第十一集': '第十一集-仙府奇遇',
        '第十三集': '第十三集-仙魔大战',
        '第十四集': '第十四集-混沌初开',
        '第十五集': '第十五集-洪荒再现',
        '第十六集': '第十六集-封神之战',
        '第十七集': '第十七集-天道轮回',
        '第十八集': '第十八集-万法归宗',
        '第十九集': '第十九集-大道无形',
        '第二十集': '第二十集-虚空破碎',
        '第二十一集': '第二十一集-时空逆转',
        '第二十二集': '第二十二集-因果循环',
        '第二十三集': '第二十三集-命运抉择',
        '第二十四集': '第二十四集-终极对决',
        '第二十五集': '第二十五集-重生归来',
        '第二十六集': '第二十六集-宇宙起源',
        '第二十七集': '第二十七集-创世之光',
        '第二十八集': '第二十八集-永恒传说'
    }
    
    # 删除之前创建的目录
    for episode_key in episode_info.keys():
        episode_display_name = episode_names.get(episode_key, f"{episode_key}-未知章节")
        if os.path.exists(episode_display_name):
            import shutil
            shutil.rmtree(episode_display_name)
    
    # 创建新的目录结构
    for episode_key, info in episode_info.items():
        # 获取集数的中文名称
        episode_display_name = episode_names.get(episode_key, f"{episode_key}-未知章节")
        
        # 创建集数文件夹
        os.makedirs(episode_display_name, exist_ok=True)
        
        # 复制并重命名章节文件
        combined_content = ""
        
        for i, ((number, filename), chapter_title) in enumerate(zip(info['files'], info['chapter_titles'])):
            # 新的章节文件名（使用真实标题）
            new_filename = f"第{i+1}章-{chapter_title}.txt"
            
            # 读取原文件内容
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 写入新文件
                with open(os.path.join(episode_display_name, new_filename), 'w', encoding='utf-8') as f:
                    f.write(content)
                
                # 添加到合并内容
                combined_content += f"\n{'='*50}\n{episode_key} 第{i+1}章 {chapter_title}\n{'='*50}\n\n"
                combined_content += content
                combined_content += "\n\n"
                
            except Exception as e:
                print(f"Error processing {filename}: {e}")
        
        # 创建该集的所有章节合并文件
        combined_filename = f"{episode_display_name}.txt"
        with open(os.path.join(episode_display_name, combined_filename), 'w', encoding='utf-8') as f:
            f.write(combined_content.strip())
        
        print(f"处理完成: {episode_display_name}")

if __name__ == "__main__":
    print("开始提取原著真实章节标题...")
    episode_info = extract_real_chapter_titles()
    
    print("\n发现的集数和章节:")
    for episode_name in sorted(episode_info.keys()):
        chapters = len(episode_info[episode_name]['files'])
        titles = episode_info[episode_name]['chapter_titles'][:3]  # 显示前3个标题
        print(f"{episode_name}: {chapters} 章")
        print(f"  前3章标题: {titles}")
    
    print("\n开始创建目录结构...")
    create_new_structure_with_real_titles(episode_info)
    print("目录结构调整完成!")