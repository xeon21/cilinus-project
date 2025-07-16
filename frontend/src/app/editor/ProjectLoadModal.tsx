// frontend/src/app/editor/ProjectLoadModal.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { Scene, Content } from '@/store/editorStore';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white; padding: 1.5rem;
  border-radius: 8px;
  width: 90%; 
  max-width: 1200px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.85rem;
`;

const SearchButton = styled.button`
  background: #16a085;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
  &:hover { background: #117a65; }
`;

const TableWrapper = styled.div`
  overflow-y: visible;
  position: relative;
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1rem;
`;

const ProjectTable = styled.table`
  width: 100%; border-collapse: collapse;
`;

const Th = styled.th<{ width?: string }>`
  background-color: #f8f9fa; 
  padding: 0.7rem 1rem;
  text-align: left;
  font-size: 0.9rem;
  color: #333; 
  border-bottom: 2px solid #dee2e6;
  position: sticky; 
  top: 0;
  width: ${props => props.width || 'auto'};
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 0.5rem 1rem; 
  border-bottom: 1px solid #e9ecef; 
  font-size: 0.85rem; 
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
`;

const ActionButton = styled.button`
  background: #3498db; 
  color: white; 
  border: none; 
  padding: 0.35rem 0.7rem;
  border-radius: 4px; 
  cursor: pointer; 
  font-size: 0.75rem;
  &:hover { background: #2980b9; }
`;

const CloseButton = styled.button`
  margin-top: 1rem; 
  align-self: flex-end;
  background: #bdc3c7; 
  color: #333; 
  border: none; 
  padding: 0.6rem 1.2rem;
  border-radius: 4px; 
  cursor: pointer; 
  font-size: 0.9rem;
`;

const ThumbnailWrapper = styled.div`
    width: 70px; 
    height: 39.37px;
    border-radius: 4px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    font-size: 1.2rem;
    color: #999;
    cursor: default;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
    }
`;

// [수정] PreviewPopup이 동적 top, left 값을 받도록 인터페이스와 스타일 수정
interface PreviewPopupProps {
  $top: number;
  $left: number;
}

const PreviewPopup = styled.div<PreviewPopupProps>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  /* [수정] transform 속성을 변경하여 세로 중앙 정렬을 개선합니다. */
  transform: translateY(-50%);
  width: 240px;
  height: 135px;
  border: 1px solid #ccc;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  border-radius: 8px;
  z-index: 1010;
  pointer-events: none;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.2s;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  span {
      font-size: 0.9rem;
      color: #777;
  }
`;

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
`;

// [수정] active prop을 $active로 변경
const PageButton = styled.button<{ $active?: boolean }>`
    padding: 0.5rem 0.8rem;
    border: 1px solid ${props => props.$active ? '#3498db' : '#ccc'};
    background-color: ${props => props.$active ? '#3498db' : 'white'};
    color: ${props => props.$active ? 'white' : '#333'};
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;


interface Project {
  id: number;
  name: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string | null;
}

interface PreviewData {
  src: string;
  type: 'image' | 'video';
}

interface ProjectLoadModalProps {
  onClose: () => void;
  onLoad: (projectId: number) => void;
}

export const ProjectLoadModal = ({ onClose, onLoad }: ProjectLoadModalProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  // [추가] 미리보기 팝업의 위치를 저장할 state
  const [previewPosition, setPreviewPosition] = useState<{ top: number, left: number } | null>(null);

  const [authorSearch, setAuthorSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (authorSearch) params.append('author', authorSearch);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', String(currentPage));
      params.append('limit', String(limit));
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { params });
      setProjects(response.data.data);
      setTotalPages(response.data.lastPage);
    } catch (error) {
      console.error("프로젝트 목록 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [authorSearch, startDate, endDate, currentPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  // [수정] handleMouseEnter가 마우스 이벤트를 받아 위치를 계산하도록 변경
  const handleMouseEnter = (event: React.MouseEvent<HTMLTableRowElement>, thumbnail: string | null) => {
    if (thumbnail && (thumbnail.startsWith('data:image') || thumbnail.startsWith('data:video'))) {
      const type = thumbnail.startsWith('data:image') ? 'image' : 'video';
      setPreview({ src: thumbnail, type });

      const rowRect = event.currentTarget.getBoundingClientRect();
      const firstColumn = event.currentTarget.cells[0];

      if(firstColumn) {
        const firstColumnRect = firstColumn.getBoundingClientRect();
        const popupWidth = 240; 
        // 첫 번째 컬럼(프로젝트 이름) 바로 오른쪽에 팝업이 나타나도록 left 위치 계산
        const left = firstColumnRect.right + - (popupWidth * 0.3); 
        // 행의 세로 중앙에 팝업이 나타나도록 top 위치 계산
        const top = rowRect.top + (rowRect.height / 2);
        
        setPreviewPosition({ top, left });
      }

    } else {
      setPreview(null);
    }
  };

  // [수정] handleMouseLeave가 위치 정보도 함께 초기화하도록 변경
  const handleMouseLeave = () => {
    setPreview(null);
    setPreviewPosition(null);
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>프로젝트 불러오기</Title>

        <FilterWrapper>
            <FilterInput 
              type="text" 
              placeholder="작성자 이름으로 검색" 
              value={authorSearch}
              onChange={(e) => setAuthorSearch(e.target.value)}
            />
            <FilterInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span>~</span>
            <FilterInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <SearchButton onClick={fetchProjects}>검색</SearchButton>
        </FilterWrapper>

        <TableWrapper onMouseLeave={handleMouseLeave}>
          <ProjectTable>
            <thead>
              <tr>
                <Th width="30%">프로젝트 이름</Th>
                <Th width="15%">작성자</Th>
                <Th width="20%">미리보기</Th>
                <Th width="20%">최근 수정일</Th>
                <Th width="15%">작업</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><Td colSpan={5}>로딩 중...</Td></tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} onMouseEnter={(e) => handleMouseEnter(e, project.thumbnail)}>
                    <Td title={project.name}>{project.name}</Td>
                    <Td title={project.author || 'N/A'}>{project.author || 'N/A'}</Td>
                    <Td>
                      <ThumbnailWrapper>
                        {project.thumbnail?.startsWith('data:image') ? 
                          <img src={project.thumbnail} alt={`${project.name} 썸네일`} /> :
                          project.thumbnail?.startsWith('data:video') ? '🎬' :
                          <span>📄</span>
                        }
                      </ThumbnailWrapper>
                    </Td>
                    <Td>{new Date(project.updatedAt).toLocaleString()}</Td>
                    <Td>
                      <ActionButton onClick={() => onLoad(project.id)}>
                        불러오기
                      </ActionButton>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </ProjectTable>
        </TableWrapper>
        
        <PaginationWrapper>
            <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                이전
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton key={page} $active={page === currentPage} onClick={() => handlePageChange(page)}>
                    {page}
                </PageButton>
            ))}
            <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                다음
            </PageButton>
        </PaginationWrapper>

        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
      
      {preview && previewPosition && (
        <PreviewPopup $top={previewPosition.top} $left={previewPosition.left}>
          {preview.type === 'image' ? <img src={preview.src} alt="preview" /> : 
           preview.type === 'video' ? <video src={preview.src} muted autoPlay loop /> :
           null
          }
        </PreviewPopup>
      )}
    </ModalBackdrop>
  );
};