import os
import re
import shutil
from collections import defaultdict

def get_correct_episode_names():
    """获取正确的集数名称映射"""
    return {
        '第一集': '第一集-误入天庭',
        '第二集': '第二集-星星宫·寒冰原', 
        '第三集': '第三集-黑狱争锋',
        '第四集': '第四集-释魂龙戒',
        '第五集': '第五集-十八灭魔手',
        '第六集': '第六集-天籁之城',
        '第七集': '第七集-风云变幻',
        '第八集': '第八集-阗殛魔杖',
        '第九集': '第九集-大幻佛境',
        '第十集': '第十集-重返天庭',
        '第十一集': '第十一集-逆天宝镜',
        '第十三集': '第十三集-灵鬼双尊',
        '第十四集': '第十四集-大罗上仙令',
        '第十五集': '第十五集-逆行通道',
        '第十六集': '第十六集-赤明魔尊',
        '第十七集': '第十七集-危机重重',
        '第十八集': '第十八集-神之战魂',
        '第十九集': '第十九集-心鉴之花',
        '第二十集': '第二十集-始隐初现',
        '第二十一集': '第二十一集-贝冶丹鼎',
        '第二十二集': '第二十二集-厉禁天君',
        '第二十三集': '第二十三集-古神传说',
        '第二十四集': '第二十四集-极玄冰眼',
        '第二十五集': '第二十五集-鑫波神藏',
        '第二十六集': '第二十六集-原界之主',
        '第二十七集': '第二十七集-守护神兽',
        '第二十八集': '第二十八集-神罚之眼'
    }

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

def create_structure_with_correct_names(episode_info):
    """使用正确的集数名称创建目录结构"""
    
    correct_names = get_correct_episode_names()
    
    # 删除之前创建的所有目录
    print("清理之前的目录...")
    for item in os.listdir('.'):
        if os.path.isdir(item) and not item.startswith('.') and item.endswith('集'):
            shutil.rmtree(item)
            print(f"删除目录: {item}")
    
    # 创建新的目录结构
    print("\n创建新的目录结构...")
    for episode_key, info in episode_info.items():
        # 获取正确的集数名称
        episode_display_name = correct_names.get(episode_key, f"{episode_key}-未知章节")
        
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
        
        print(f"✓ 处理完成: {episode_display_name}")

if __name__ == "__main__":
    print("开始使用正确的集数名称重新整理...")
    
    # 获取正确的集数名称
    correct_names = get_correct_episode_names()
    print("\n正确的集数名称映射:")
    for key, value in correct_names.items():
        print(f"  {key} → {value}")
    
    # 提取章节信息
    episode_info = extract_real_chapter_titles()
    
    print(f"\n发现 {len(episode_info)} 个集数:")
    for episode_name in sorted(episode_info.keys()):
        chapters = len(episode_info[episode_name]['files'])
        print(f"  {episode_name}: {chapters} 章")
    
    # 创建新的目录结构
    create_structure_with_correct_names(episode_info)
    
    print("\n✓ 所有目录结构调整完成!")
    print("\n新的目录结构示例:")
    print("├── 第一集-误入天庭/")
    print("│   ├── 第1章-紫炎心.txt")
    print("│   ├── 第2章-火星传送阵.txt")
    print("│   └── 第一集-误入天庭.txt")
    print("├── 第四集-释魂龙戒/")
    print("│   ├── 第1章-蓝清会行.txt")
    print("│   ├── 第2章-重建家园.txt")
    print("│   └── 第四集-释魂龙戒.txt")
    print("└── ...")